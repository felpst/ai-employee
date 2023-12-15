import { IAIEmployee, IAIEmployeeCall, IAIEmployeeCallStep, IAgentCall } from "@cognum/interfaces";
import { ChatModel } from "@cognum/llm";
import { WebBrowser } from "@cognum/tools";
import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "langchain/prompts";
import { RunnableSequence } from "langchain/schema/runnable";
import { BehaviorSubject, Observable } from "rxjs";
import { z } from "zod";
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
    startResources,
    stepIntentClassification,
    stepIntentExecution,
    stepFinalAnswer,
    endResources,
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

  async function startResources(input?: StepInput) {
    // Start resources
    // Browser
    try {
      const headless = !process.env.SERVER_URL.includes('localhost') ? true : false;
      (call.aiEmployee as IAIEmployee).resources.browser = await new WebBrowser().start({ headless })
    } catch (error) {
      console.error('Error starting browser', error.message)
    }
  }

  async function endResources(input?: StepInput) {
    // Start resources
    (call.aiEmployee as IAIEmployee).resources.browser.close();
  }

  async function stepIntentClassification(input?: StepInput) {
    const stepIntentClassification: IAIEmployeeCallStep = {
      type: 'intent-classification',
      description: 'Intent classification',
      inputs: {
        text: call.input,
        context: {}
      },
      outputs: {},
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
    // console.log(intentClassifierResult);

    // TODO token usage
    stepIntentClassification.outputs = intentClassifierResult;
    stepIntentClassification.status = 'done';
    stepIntentClassification.endAt = new Date();
    call.steps[index - 1] = stepIntentClassification
    await call.save()
    $call.next(call)

    return stepIntentClassification;
  }

  async function stepIntentExecution(input?: StepInput) {
    const stepIntentClassification = input.lastStep;
    if (!stepIntentClassification) throw new Error('stepIntentClassification not found');

    // Agent
    let agentCall: IAgentCall;
    switch (stepIntentClassification.outputs.intention) {
      case INTENTIONS.INFORMATION_RETRIEVAL:
        const informationRetrievalAgentOptions = {
          $call,
          question: stepIntentClassification.inputs.text,
          context: stepIntentClassification.inputs.context,
          aiEmployee: call.aiEmployee as IAIEmployee
        }
        const informationRetrievalAgent = new InformationRetrievalAgent()
        await informationRetrievalAgent.call(informationRetrievalAgentOptions)
        break;
      case INTENTIONS.TASK_EXECUTION:
        const taskExecutionAgentOptions = {
          $call,
          input: stepIntentClassification.inputs.text,
          context: stepIntentClassification.inputs.context,
          aiEmployee: call.aiEmployee as IAIEmployee,
          intentions: [INTENTIONS.TASK_EXECUTION]
        }
        const taskExecutionAgent = new TaskExecutionAgent()
        await taskExecutionAgent.call(taskExecutionAgentOptions)
        break;
      // case INTENTIONS.CONFIGURATION_OR_CUSTOMIZATION:
      //   const configurationAgent = await new ConfigurationAgent(call.aiEmployee as IAIEmployee).init()
      //   agentCall = await configurationAgent.call(stepIntentClassification.input.text, intention)
      //   break;
      default:
        const generalAgent = await new GeneralAgent(call.aiEmployee as IAIEmployee).init()
        agentCall = await generalAgent.call(stepIntentClassification.inputs.text, [])
        break;
    }

    return call.steps[call.steps.length - 1];
  }

  async function stepFinalAnswer(input?: StepInput) {
    const lastStep = input.lastStep;
    if (!lastStep) throw new Error('lastStep not found');

    const stepFinalAnswer: IAIEmployeeCallStep = {
      type: 'final-answer',
      description: 'Final answer',
      inputs: {
        input: lastStep.inputs.text,
        output: lastStep.outputs.text,
      },
      outputs: {},
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
      input: stepFinalAnswer.inputs.input,
      output: stepFinalAnswer.inputs.output,
      format_instructions: parser.getFormatInstructions(),
    });

    // TODO token usage
    stepFinalAnswer.outputs = response;
    stepFinalAnswer.status = 'done';
    stepFinalAnswer.endAt = new Date();

    // Final answer
    call.output = stepFinalAnswer.outputs.answer;

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

