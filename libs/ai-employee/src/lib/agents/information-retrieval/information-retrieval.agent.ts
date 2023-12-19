import { IAIEmployee, IAIEmployeeCall, IAIEmployeeCallStep } from "@cognum/interfaces";
import { Knowledge } from '@cognum/models';
import { KnowledgeRetrieverService } from "@cognum/tools";
import { BehaviorSubject } from "rxjs";
import { INTENTIONS } from "../../utils/intent-classifier/intent-classifier.util";
import { AgentTools } from "../agent-tools/agent-tools.agent";

export interface IInformationRetrievalAgentOptions {
  $call: BehaviorSubject<IAIEmployeeCall>;
  question: string;
  context?: any;
  aiEmployee: IAIEmployee;
}

export interface IInformationRetrievalAgentOutput {
  text: string;
  accuracy: boolean;
}
export class InformationRetrievalAgent {

  async call(options: IInformationRetrievalAgentOptions): Promise<IInformationRetrievalAgentOutput> {
    const { $call, question, context, aiEmployee } = options;
    let result: IInformationRetrievalAgentOutput = {
      text: '',
      accuracy: false
    };
    let saveAnswer: boolean = true;

    // Search on memory
    result = await this.searchOnMemory(options);

    // Check answer accuracy
    if (!result.accuracy) {
      result.text = "I don't know";
      console.log('Buscar resposta em outras fontes de dados');

      // Knowledge Base
      try {
        result = await this.searchOnKnowledgeBase(options);
        if (result.accuracy) { saveAnswer = false; }
      } catch (error) {
        console.error('knowledgeBaseResult', error.message);
      }

      // Search using tools
      if (!result.accuracy) {
        try {
          result = await this.searchOnTools(options);
        } catch (error) {
          console.error('Search using tools', error.message);
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

    if (result.accuracy && saveAnswer) {
      // Salvar Resposta
      await this.updateMemory(options, result);
    }

    // Retornar a resposta
    return result;
  }

  async searchOnMemory(options: IInformationRetrievalAgentOptions): Promise<IInformationRetrievalAgentOutput> {
    const { $call, question, context, aiEmployee } = options;

    const call = options.$call.value;
    const step: IAIEmployeeCallStep = {
      type: 'action',
      description: 'Search on AI Employee Memory',
      inputs: {
        text: question,
        context: context || {}
      },
      outputs: {},
      tokenUsage: 0,
      status: 'running',
      startAt: new Date(),
      endAt: null
    };
    const index = call.steps.push(step);
    await call.save();
    $call.next(call);

    // Memory Search
    const memorySearchResult = await aiEmployee.memorySearch(options.question);

    // TODO token usage
    step.outputs = {
      text: memorySearchResult.answer,
      accuracy: memorySearchResult.accuracy,
    };
    step.status = 'done';
    step.endAt = new Date();

    // Update call
    call.steps[index - 1] = step;
    await call.save();
    $call.next(call);

    return step.outputs;
  }

  async searchOnKnowledgeBase(options: IInformationRetrievalAgentOptions): Promise<IInformationRetrievalAgentOutput> {
    const { $call, question, context, aiEmployee } = options;

    const call = options.$call.value;
    const step: IAIEmployeeCallStep = {
      type: 'action',
      description: 'Search on Knowledge Base',
      inputs: {
        text: question,
        context: context || {}
      },
      outputs: {},
      tokenUsage: 0,
      status: 'running',
      startAt: new Date(),
      endAt: null
    };
    const index = call.steps.push(step);
    await call.save();
    $call.next(call);

    // Knowledge Base Search
    const knowledgeRetrieverService = new KnowledgeRetrieverService();

    const knowledges =
      (await Knowledge.find({ workspace: aiEmployee.workspace.toString() })
        .select('openaiFileId').lean());
    const fileIds = knowledges.map(({ openaiFileId }) => openaiFileId);

    const knowledgeBaseResponse = await knowledgeRetrieverService
      .askToAssistant(question, fileIds);
    const accuracy = await aiEmployee.checkValidAnswer(question, knowledgeBaseResponse);

    // TODO token usage
    step.outputs = {
      text: knowledgeBaseResponse,
      accuracy,
    };
    step.status = 'done';
    step.endAt = new Date();

    // Update call
    call.steps[index - 1] = step;
    await call.save();
    $call.next(call);

    return {
      text: knowledgeBaseResponse,
      accuracy
    };
  }

  async searchOnTools(options: IInformationRetrievalAgentOptions): Promise<IInformationRetrievalAgentOutput> {
    const { $call, question, context, aiEmployee } = options;

    // Search using tools
    const searchOnToolsResult: IInformationRetrievalAgentOutput = await new Promise(async resolve => {
      console.log('Searching using tools');
      const agentTools = new AgentTools();
      const output = await agentTools.call({
        $call,
        aiEmployee,
        input: question,
        context,
        intentions: [INTENTIONS.INFORMATION_RETRIEVAL]
      });
      if (output === 'NOT_POSSIBLE_TO_EXECUTE_THIS_ACTION') {
        console.log('Search on tools not possible');
        resolve({ text: "I don't know", accuracy: false });
      }
      const accuracy = await aiEmployee.checkValidAnswer(question, output);
      resolve({ text: output, accuracy });
    });

    return searchOnToolsResult;
  }

  async updateMemory(options: IInformationRetrievalAgentOptions, result: IInformationRetrievalAgentOutput): Promise<IInformationRetrievalAgentOutput> {
    const { $call, question, context, aiEmployee } = options;

    const call = options.$call.value;
    const step: IAIEmployeeCallStep = {
      type: 'action',
      description: 'Update Memory',
      inputs: {
        question,
        answer: result.text
      },
      outputs: {},
      tokenUsage: 0,
      status: 'running',
      startAt: new Date(),
      endAt: null
    };
    const index = call.steps.push(step);
    await call.save();
    $call.next(call);

    // Update AIEmployee Memory
    const instruction = `Check if there is any relevant information in this information to add to the database:` + JSON.stringify({ question, answer: result.text });
    const memoryInstructionResult = await aiEmployee.memoryInstruction(instruction, context);
    console.log('memoryInstructionResult', JSON.stringify(memoryInstructionResult));

    // TODO token usage
    step.outputs = {
      text: result.text,
      ...memoryInstructionResult
    };
    step.status = 'done';
    step.endAt = new Date();

    // Update call
    call.steps[index - 1] = step;
    await call.save();
    $call.next(call);

    return result;
  }
}
