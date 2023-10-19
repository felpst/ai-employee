import { InitializeAgentExecutorOptions, initializeAgentExecutorWithOptions } from "langchain/agents";
import { ChatOpenAI, OpenAIChatInput } from "langchain/chat_models/openai";
import { BaseChatModelParams } from "langchain/dist/chat_models/base";
import { DynamicTool } from "langchain/tools";
import { GoogleCalendarAgentParams, GoogleCalendarCreateTool, GoogleCalendarViewTool } from "langchain/tools/google_calendar";

      type OpenAIOptions = Partial<OpenAIChatInput> &
        BaseChatModelParams & {
          concurrency?: number
          cache?: boolean
          openAIApiKey?: string
        }

      export type CalendarAgentParams = {
        mode?: 'create' | 'view' | 'full'
        calendarOptions: GoogleCalendarAgentParams
        executorOptions?: InitializeAgentExecutorOptions
        openApiOptions?: OpenAIOptions
      }
      

      export class GoogleCalendarAgent extends DynamicTool {
        protected tools: any[]
        protected agent: any
        protected openApiOptions: any
        protected executorOptions: InitializeAgentExecutorOptions

        constructor({
          mode = 'full',
          calendarOptions,
          openApiOptions = { temperature: 0 },
          executorOptions = {
            agentType: 'chat-zero-shot-react-description',
            verbose: true
          }
        }: CalendarAgentParams) {
          super({
            name: 'Google Calendar',
            description:
              'Use to access Google Calendar. Input should be a task instruction to executor.',
            func: async (input) => {
              this.openApiOptions = openApiOptions
              this.executorOptions = executorOptions
              this.tools =
                mode === 'create'
                  ? [new GoogleCalendarCreateTool(calendarOptions)]
                  : mode === 'view'
                  ? [new GoogleCalendarViewTool(calendarOptions)]
                  : [
                      new GoogleCalendarCreateTool(calendarOptions),
                      new GoogleCalendarViewTool(calendarOptions)
                    ]
              this.agent = await initializeAgentExecutorWithOptions(
                this.tools,
                new ChatOpenAI(this.openApiOptions),
                this.executorOptions
              )

              const response = await this.agent.call({ input })
              return response
            }
          })
        }
      }
