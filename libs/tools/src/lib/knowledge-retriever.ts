import { Knowledge, Workspace } from '@cognum/models';
import { DynamicTool } from 'langchain/tools';
import OpenAI from 'openai';

interface KnowledgeRetrieverParams {
  identity: string,
  workspaceId: string,
  openaiAssistantId: string;
}

export class KnowledgeRetrieverTool extends DynamicTool {
  constructor(params: KnowledgeRetrieverParams) {
    const openai = new OpenAI();

    super({
      name: 'Knowledge Retriever',
      description: 'Get informations from the knowledge added to the assistant. Input must be a question.',
      func: async (input: string) => {
        try {
          const { openaiThreadId } = (await Workspace.findById(params.workspaceId)).toObject();
          const knowledges = (await Knowledge.find({ workspace: params.workspaceId }).select('openaiFileId'));

          const fileIds = knowledges.map(knowledge => knowledge.openaiFileId);

          await openai.beta.threads.messages.create(openaiThreadId, {
            role: "user",
            content: input,
            file_ids: fileIds
          });

          const run = await openai.beta.threads.runs.create(openaiThreadId, {
            assistant_id: params.openaiAssistantId,
            instructions: `${params.identity}\nUse your knowledge base to best respond to queries.`,
            tools: [{ type: 'retrieval' }],
            model: "gpt-4-1106-preview"
          });

          // await thread run to complete
          let currentRun: OpenAI.Beta.Threads.Runs.Run =
            await openai.beta.threads.runs.retrieve(openaiThreadId, run.id);

          while (currentRun.status !== 'completed') {
            currentRun = await openai.beta.threads.runs.retrieve(openaiThreadId, run.id);

            if (['cancelled', 'cancelling', 'failed', 'expired', 'requires_action'].includes(currentRun.status)) // TODO: handle requires_action status
              throw new Error(`OpenAI assistant run failed with status "${currentRun.status}"`);
          }

          const messages = await openai.beta.threads.messages.list(openaiThreadId);
          const response = messages.data[0].content[0] as OpenAI.Beta.Threads.Messages.MessageContentText;

          return `${response.text}`;
        } catch (error) {
          console.error(error);
        }
      }
    });
  }

}
