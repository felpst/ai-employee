import { IAIEmployee, IAgentCall } from "@cognum/interfaces";
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

    // Search on memory
    console.log('RETRIEVAL MEMORY', JSON.stringify(this.aiEmployee.memory));
    const response = await this.aiEmployee.memorySearch(question);
    console.log('response', JSON.stringify(response));
    let output = response.answer;

    // Check answer accuracy
    if (!response.accuracy) {
      console.log('Buscar resposta em outras fontes de dados');

      // Search using tools
      const agentTools = await new AgentTools(this.aiEmployee, [INTENTIONS.INFORMATION_RETRIEVAL]).init();
      output = await agentTools.call(question);

      // TODO Listar todas as fontes de dados disponíveis
      // - Histórico do chat atual
      // - Knowledge Base
      // - Banco de dados
      // - Internet

      // TODO Ordenar fontes de dados por relevância

      // TODO Escolher apenas as 3 fontes de dados mais relevantes

      // TODO Buscar resposta em todas as fontes de dados escolhidas

      // Verificar resposta, tentar em outra ferramenta se necessário

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
