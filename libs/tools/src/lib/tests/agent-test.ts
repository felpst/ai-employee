import { ChatModel } from "@cognum/llm";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { BufferMemory } from "langchain/memory";

export async function agentTest(tools: any[], verbose = true) {
  const model = new ChatModel();
  const executor = await initializeAgentExecutorWithOptions(tools, model, {
    agentType: 'structured-chat-zero-shot-react-description',
    verbose,
    memory: new BufferMemory({
      memoryKey: "chat_history",
      returnMessages: true,
    }),
    agentArgs: {
      inputVariables: ["input", "agent_scratchpad", "chat_history"],
    },
  });
  return executor;
}
