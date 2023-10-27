import { ChatModel } from '@cognum/llm';
import { Document } from 'langchain/document';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from 'langchain/prompts';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { z } from 'zod';

interface DocumentContextStructure {
  documentName: string
  sections: Array<{
    name: string
    startLine: number
    endLine: number
  }>
}

export default class ContextualTextSplitter extends RecursiveCharacterTextSplitter {
  async splitBySection(documents: Document[]) {
    return Promise.all(documents.map(async (document) => {
      document.pageContent = this.removeDoubleLineBreaks(document.pageContent)

      const { documentName, sections: documentSections } = await this.generateContextualData(document.pageContent)

      const splitted: Document[] = []

      for (const section of documentSections) {
        const { name: sectionName, startLine, endLine } = section
        const sectionParts: Document[] = []
        
        const charsInSection = this.countCharactersInLines(document.pageContent, startLine, endLine)
        const sectionDocument = new Document({
          pageContent: this.getSectionContent(document.pageContent, startLine, endLine),
          metadata: {
            ...document.metadata,
            loc: {
              lines: {
                from: startLine,
                to: endLine
              }
            }
          }
        })
        
        if (charsInSection > this.chunkSize) {
          const slices = await this.splitDocuments([sectionDocument])
          slices.forEach((slice, index) => {
            // define line coordinates for slices
            const sliceStartLine =  index === 0 ? startLine : slices[index - 1].metadata.loc.lines.to + 1
            const sliceEndLine = index === slices.length -1 ? endLine : sliceStartLine + slice.pageContent.split('\n').length
            
            slice.metadata = {
              ...slice.metadata,
              loc: {
                lines: {
                  from: sliceStartLine,
                  to: sliceEndLine
                }
              }
            }
          })
          sectionParts.push(...slices)
        } else {
          sectionParts.push(sectionDocument)
        }
        
        sectionParts.forEach((part, partIndex) => {
          const header = `${documentName} - ${sectionName}${sectionParts.length > 1 ? ` (Part ${partIndex + 1})` : ''}\n\n---\n\n`
          part.pageContent = header + part.pageContent
        })

        splitted.push(...sectionParts)
      }

      return splitted
    })).then(arrayOfArray => arrayOfArray.flat())
  }

  private async generateContextualData(text: string): Promise<DocumentContextStructure> {
    const model = new ChatModel({ temperature: 0, streaming: false });

    const jsonParser = StructuredOutputParser.fromZodSchema(
      z.object({
        documentName: z.string().describe("Name of the document based on its content"),
        sections: z
          .array(
            z.object({
              name: z.string().describe("Name of the section"),
              startLine: z.number().describe("The line where the named section begins"),
              endLine: z.number().optional().describe(`The line where the named section ends`),
            })
          )
          .describe(`Array of the definition of document sections`),
      })
    )
  
    const prompt = new ChatPromptTemplate({
      promptMessages: [
        SystemMessagePromptTemplate.fromTemplate(
          "Format the output for the documents following the instructions: \n{format_instructions}\n Human input: {inputText}"
        ),
        HumanMessagePromptTemplate.fromTemplate("{inputText}"),
      ],
      partialVariables: { format_instructions: jsonParser.getFormatInstructions() },
      inputVariables: ["inputText"],
    });
  
    const input = await prompt.format({ inputText: text })
  
  
    const result = await model.invoke(input)
    return this.tryParseDocumentStructure(result.content);
  }

  private tryParseDocumentStructure(rawTextStructure: string): DocumentContextStructure {
    try {
      const jsonStart = rawTextStructure.indexOf("{");
      const jsonEnd = rawTextStructure.lastIndexOf("}");
      
      const jsonString = rawTextStructure.substring(jsonStart, jsonEnd + 1)
    
      return JSON.parse(jsonString)
    } catch (error) {
      throw new Error('It was not possible to parse document structure to JSON.')
    }
  }

  private countCharactersInLines(text: string, startLine: number, endLine: number) {
    const lines = text.split('\n');
    let characterCount = 0;
  
    for (let i = startLine - 1; i < endLine && i < lines.length; i++) {
      characterCount += lines[i].length;
      if (i < endLine - 1) {
        characterCount++;
      }
    }
  
    return characterCount;
  }

  private getSectionContent(text: string, startLine: number, endLine: number) {
    const lines = text.split('\n');
    return lines.slice(startLine -1, endLine).join('\n')
  }

  private removeDoubleLineBreaks(text: string): string {
    const cleanedText = text.replace(/(\r\n|\n|\r){2,}/g, '\n');
    if (cleanedText.match(/(\r\n|\n|\r){2,}/)) {
      return this.removeDoubleLineBreaks(cleanedText);
    }
  
    return cleanedText;
  }
}