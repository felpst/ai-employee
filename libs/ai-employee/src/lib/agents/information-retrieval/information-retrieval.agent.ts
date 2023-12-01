import { IAIEmployee, IAgentCall } from "@cognum/interfaces";
import { INTENTIONS } from "../../utils/intent-classifier/intent-classifier.util";
import { Agent } from "../agent";

export class InformationRetrievalAgent extends Agent {

  constructor(public aiEmployee: IAIEmployee) {
    super(aiEmployee);
    this.agent = INTENTIONS.INFORMATION_RETRIEVAL
  }

  async call(question: string): Promise<IAgentCall> {
    const agentCall = await this._initCall(question);

    // Search on memory
    console.log('RETRIEVEL MEMORY', JSON.stringify(this.memory.get()));
    const response = await this.memory.search(question, this.context);

    // Check answer accuracy
    if (!response.accuracy) {
      console.log('Buscar resposta em outras fontes de dados');

      // TODO Listar todas as fontes de dados disponíveis
      // - Histórico do chat atual
      // - Knowledge Base
      // - Banco de dados
      // - Internet

      // TODO Ordenar fontes de dados por relevância

      // TODO Escolher apenas as 3 fontes de dados mais relevantes

      // TODO Buscar resposta em todas as fontes de dados escolhidas

      // TODO Retornar a resposta
    }

    await this._afterCall(agentCall, response.answer);

    return agentCall;
  }
}
