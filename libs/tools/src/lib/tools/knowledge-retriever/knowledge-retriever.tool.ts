import { Knowledge, Workspace } from '@cognum/models';
import { DynamicTool } from 'langchain/tools';
import OpenAI from 'openai';
import { KnowledgeRetrieverToolSettings } from './knowledge-retriever.interfaces';

export class KnowledgeRetrieverTool extends DynamicTool {
  constructor(settings: KnowledgeRetrieverToolSettings) {
    const openai = new OpenAI();

    super({
      name: 'Knowledge Retriever',
      metadata: { id: "knowledge-retriever" },
      description: 'Get informations from the knowledge added to the assistant. Input must be a question.',
      func: async (input: string) => {
        try {
          const thread = await openai.beta.threads.create();

          const { openaiAssistantId } = await Workspace.findById(settings.workspaceId).lean();
          const knowledges = (await Knowledge.find({ workspace: settings.workspaceId }).select('openaiFileId').lean());

          const fileIds = knowledges.map(knowledge => knowledge.openaiFileId);

          await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: input,
            file_ids: fileIds
          });

          const run = await openai.beta.threads.runs.create(thread.id, {
            assistant_id: openaiAssistantId,
            instructions: `You are a smart assistant that retrieves information using your knowledge. Your answer to the questions must be as objective as possible.`,
            tools: [{ type: 'retrieval' }],
            model: "gpt-4-1106-preview"
          });

          // await thread run to complete
          let currentRun: OpenAI.Beta.Threads.Runs.Run =
            await openai.beta.threads.runs.retrieve(thread.id, run.id);

          while (currentRun.status !== 'completed') {
            currentRun = await openai.beta.threads.runs.retrieve(thread.id, run.id);
            if (['cancelled', 'cancelling', 'failed', 'expired', 'requires_action'].includes(currentRun.status))
              throw new Error(`OpenAI assistant run failed with status "${currentRun.status}"`);
            await new Promise(r => setTimeout(r, 100)); // avoids half of the requests
          }

          const messages = await openai.beta.threads.messages.list(thread.id);
          const response = messages.data[0].content[0] as OpenAI.Beta.Threads.Messages.MessageContentText;

          await openai.beta.threads.del(thread.id);
          return response.text.value;
        } catch (error) {
          console.error(error);
          return error.message;
        }
      }
    });
  }

}
