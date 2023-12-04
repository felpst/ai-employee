import { IAIEmployee, IAgentCall } from "@cognum/interfaces";
import { KnowledgeRetrieverService } from "@cognum/tools";
import { INTENTIONS } from "../../utils/intent-classifier/intent-classifier.util";
import { Agent } from "../agent";
import { AgentTools } from "../agent-tools/agent-tools.agent";

export class InformationRetrievalAgent extends Agent {

  constructor(public aiEmployee: IAIEmployee) {
    super(aiEmployee);
    this.agent = INTENTIONS.INFORMATION_RETRIEVAL
  }

  async call(question: string, intent: string): Promise<IAgentCall> {
    const agentCall = await this._initCall(question, intent);
    let saveAnswer: boolean = true;
    let hasAnswer: boolean = false;
    let output = "I don't know";

    // Search on memory
    // console.log('RETRIEVAL MEMORY', JSON.stringify(this.aiEmployee.memory));
    const response = await this.aiEmployee.memorySearch(question);
    hasAnswer = response.accuracy;
    // console.log('response', JSON.stringify(response));

    // Check answer accuracy
    if (!hasAnswer) {
      output = "I don't know";
      console.log('Buscar resposta em outras fontes de dados');

      // Knowledge Base
      try {
        const knowledgeRetrieverService = new KnowledgeRetrieverService({ workspaceId: this.aiEmployee.workspace.toString() })
        const knowledgeBaseResponse = await knowledgeRetrieverService.question(question)
        if (knowledgeBaseResponse) {
          output = knowledgeBaseResponse;
          hasAnswer = await this.aiEmployee.checkValidAnswer(question, output)
          if (hasAnswer) saveAnswer = false;
          console.log('knowledgeBaseResponse', knowledgeBaseResponse);
          console.log('hasAnswer', hasAnswer);
        }
      } catch (error) {
        console.error('knowledgeBaseResponse', error.message)
      }


      // Search using tools
      if (!hasAnswer) {
        try {
          console.log('Searching using tools');
          const agentTools = await new AgentTools(this.aiEmployee, [INTENTIONS.INFORMATION_RETRIEVAL]).init();
          output = await agentTools.call(question);
          hasAnswer = await this.aiEmployee.checkValidAnswer(question, output)
          console.log('hasAnswer', hasAnswer);
        } catch (error) {
          console.error('Search using tools', error.message)
        }
      }

      // TODO Listar todas as fontes de dados disponíveis
      // - Histórico do chat atual
      // - Banco de dados
      // - Internet

      // TODO Ordenar fontes de dados por relevância

      // TODO Escolher apenas as 3 fontes de dados mais relevantes

      // TODO Buscar resposta em todas as fontes de dados escolhidas

      // Verificar resposta, tentar em outra ferramenta se necessário


    }

    if (hasAnswer && saveAnswer) {
      // Salvar Resposta
      await this.updateMemory(question, output)
    }

    await this._afterCall(agentCall, output);

    // Retornar a resposta
    return agentCall;
  }

  async updateMemory(input: string, output: string) {
    // Update AIEmployee Memory
    const instruction = `Check if there is any relevant information in this information to add to the database:` + JSON.stringify({ input, output })
    const memoryInstructionResult = await this.aiEmployee.memoryInstruction(instruction, this.context)
    console.log('memoryInstructionResult', JSON.stringify(memoryInstructionResult));
  }
}
