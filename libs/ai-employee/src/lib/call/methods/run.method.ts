import { IAIEmployee, IAIEmployeeCall, IAIEmployeeCallStep, IAgent, IAgentCall } from "@cognum/interfaces";
import { ChatModel } from "@cognum/llm";
import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "langchain/prompts";
import { RunnableSequence } from "langchain/schema/runnable";
import { BehaviorSubject, Observable } from "rxjs";
import { z } from "zod";
import { ConfigurationAgent } from "../../agents/configuration";
import { GeneralAgent } from "../../agents/general";
import { InformationRetrievalAgent } from "../../agents/information-retrieval";
import { TaskExecutionAgent } from "../../agents/task-execution";
import { INTENTIONS, intentClassifier } from "../../utils/intent-classifier/intent-classifier.util";

interface StepInput {
  lastStep?: IAIEmployeeCallStep;
}

export function run(): Observable<IAIEmployeeCall> {
  const call = this as IAIEmployeeCall;
  const $call = new BehaviorSubject<IAIEmployeeCall>(call);

  let nextStep = 0;
  const runnableSequence = [
    async () => { $call.next(call) },
    startRun,
    stepIntentClassification,
    stepIntentExecution,
    stepFinalAnswer,
    endRun
  ]

  // Run steps
  new Promise(async () => {
    let lastStep = null;
    while (nextStep < runnableSequence.length) {
      try {
        const runnable = runnableSequence[nextStep];
        lastStep = await runnable({ lastStep });
        nextStep++;
      } catch (error) {
        console.log(error);
        nextStep = runnableSequence.length - 1;
      }
    }
  })

  return $call;

  async function startRun(input?: StepInput) {
    call.status = 'running';
    call.startAt = new Date();
    await call.save()
    $call.next(call)
  }

  async function stepIntentClassification(input?: StepInput) {
    const stepIntentClassification: IAIEmployeeCallStep = {
      type: 'intent-classification',
      input: {
        text: call.input,
        context: {}
      },
      output: {},
      tokenUsage: 0,
      status: 'running',
      startAt: new Date(),
      endAt: null
    }
    const index = call.steps.push(stepIntentClassification);
    await call.save()
    $call.next(call)

    // Run intent classification
    const intentClassifierResult = await intentClassifier(call.input)
    console.log(intentClassifierResult);

    // TODO token usage
    stepIntentClassification.output = intentClassifierResult;
    stepIntentClassification.status = 'done';
    stepIntentClassification.endAt = new Date();
    call.steps[index - 1] = stepIntentClassification
    console.log(JSON.stringify(call.steps))
    await call.save()
    $call.next(call)

    return stepIntentClassification;
  }

  async function stepIntentExecution(input?: StepInput) {
    const stepIntentClassification = input.lastStep;
    if (!stepIntentClassification) throw new Error('stepIntentClassification not found');

    const stepAction: IAIEmployeeCallStep = {
      type: 'action',
      input: {
        text: stepIntentClassification.input.text,
        intent: stepIntentClassification.output
      },
      output: {},
      tokenUsage: 0,
      status: 'running',
      startAt: new Date(),
      endAt: null
    }
    const index = call.steps.push(stepAction);
    await call.save()
    $call.next(call)

    // Agent
    let agent: IAgent;
    let agentCall: IAgentCall;
    const intention = stepIntentClassification.output.intention
    switch (intention) {
      case INTENTIONS.INFORMATION_RETRIEVAL:
        agent = new InformationRetrievalAgent(call.aiEmployee as IAIEmployee)
        agentCall = await agent.call(stepIntentClassification.input.text, intention)
        break;
      case INTENTIONS.TASK_EXECUTION:
        agent = await new TaskExecutionAgent(call.aiEmployee as IAIEmployee).init()
        agentCall = await agent.call(stepIntentClassification.input.text, intention)
        break;
      case INTENTIONS.CONFIGURATION_OR_CUSTOMIZATION:
        agent = await new ConfigurationAgent(call.aiEmployee as IAIEmployee).init()
        agentCall = await agent.call(stepIntentClassification.input.text, intention)
        break;
      default:
        agent = await new GeneralAgent(call.aiEmployee as IAIEmployee).init()
        agentCall = await agent.call(stepIntentClassification.input.text, intention)
        break;
    }

    // TODO token usage
    stepAction.output = {
      text: agentCall.output
    };
    stepAction.status = 'done';
    stepAction.endAt = new Date();

    // Update call
    call.steps[index - 1] = stepAction
    await call.save()
    $call.next(call)

    return stepAction
  }

  async function stepFinalAnswer(input?: StepInput) {
    const stepAction = input.lastStep;
    if (!stepAction) throw new Error('stepAction not found');

    const stepFinalAnswer: IAIEmployeeCallStep = {
      type: 'final-answer',
      input: {
        input: stepAction.input.text,
        output: stepAction.output.text,
      },
      output: {},
      tokenUsage: 0,
      status: 'running',
      startAt: new Date(),
      endAt: null
    }
    const index = call.steps.push(stepFinalAnswer);
    await call.save()
    $call.next(call)

    const parser = StructuredOutputParser.fromZodSchema(
      z.object({
        answer: z.string().describe("the answer for the user.")
      })
    );

    const chain = RunnableSequence.from([
      PromptTemplate.fromTemplate(
        `Task: You need to create a friendly answer like a chat for the user using only data below:
        User Input: {input}
        Process Output: {output}
        ---
        {format_instructions}`
      ),
      new ChatModel(),
      parser,
    ]);

    const response = await chain.invoke({
      input: stepFinalAnswer.input.input,
      output: stepFinalAnswer.input.output,
      format_instructions: parser.getFormatInstructions(),
    });

    // TODO token usage
    stepFinalAnswer.output = response;
    stepFinalAnswer.status = 'done';
    stepFinalAnswer.endAt = new Date();

    // Final answer
    call.output = stepFinalAnswer.output.answer;

    // Update call
    call.steps[index - 1] = stepFinalAnswer
    await call.save()
    $call.next(call)

    return stepFinalAnswer;
  }

  async function endRun(input?: StepInput) {
    call.status = 'done';
    call.endAt = new Date();
    await call.save()
    $call.next(call)
  }
}

