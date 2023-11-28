import { IAIEmployee } from "@cognum/interfaces";
import { Tool } from "langchain/tools";
import { AIEmployeeTools } from "../tools/ai-employee-tools";

export class AgentModuleAction {
  name: string;
  tools: Tool[];

  constructor(
    private aiEmployee: IAIEmployee
  ) {
<<<<<<< HEAD
    this.tools = AIEmployeeTools.get();
=======
    this.tools = AIEmployeeTools.get(this.aiEmployee.tools);
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe
  }

  async prompt() {
    const prefix = await this._prefix();
    const formatInstructions = await this._formatInstructions();
    const begin = await this._begin();
    const agentScratchpad = await this.agentScratchpad();

    const template = [prefix, formatInstructions, begin, agentScratchpad].join('\n\n');
    return template;
  }

  private async _prefix() {
    return `You are talking to human. The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. You can get informations in summary or history conversation without tools or use tools to get new informations. Answer the following questions truthfully and as best you can.`
  }

  private async _agentActionFormatInstructions() {
    return `Output a JSON markdown code snippet containing a valid JSON blob (denoted below by $JSON_BLOB).
This $JSON_BLOB must have a "action" key (with the name of the tool to use) and an "action_input" key (tool input).

Valid "action" values: "Final Answer" (which you must use when giving your final response to the user), or one of [{tool_names}].

The $JSON_BLOB must be valid, parseable JSON and only contain a SINGLE action. Here is an example of an acceptable output:

\`\`\`json
{{
  "action": $TOOL_NAME,
  "action_input": $INPUT
}}
\`\`\`

Remember to include the surrounding markdown code snippet delimiters (begin with "\`\`\`" json and close with "\`\`\`")!
`
  }

  private async _formatInstructions() {
    return `You have access to the following tools.
You must format your inputs to these tools to match their "JSON schema" definitions below.

"JSON Schema" is a declarative language that allows you to annotate and validate JSON documents.

For example, the example "JSON Schema" instance {{"properties": {{"foo": {{"description": "a list of test words", "type": "array", "items": {{"type": "string"}}}}}}, "required": ["foo"]}}}}
would match an object with one required property, "foo". The "type" property specifies "foo" must be an "array", and the "description" property semantically describes it as "a list of test words". The items within "foo" must be strings.
Thus, the object {{"foo": ["bar", "baz"]}} is a well-formatted instance of this example "JSON Schema". The object {{"properties": {{"foo": ["bar", "baz"]}}}} is not well-formatted.

Here are the JSON Schema instances for the tools you have access to:

{tool_schemas}

The way you use the tools is as follows:

------------------------

${this._agentActionFormatInstructions()}

If you are using a tool, "action_input" must adhere to the tool's input schema, given above.

------------------------

ALWAYS use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action:
\`\`\`json
$JSON_BLOB
\`\`\`
Observation: the result of the action
... (this Thought/Action/Observation can repeat N times)
Thought: I now know the final answer
Action:
\`\`\`json
{{
  "action": "Final Answer",
  "action_input": "Final response to human"
}}
\`\`\``
  }

  private async _begin() {
    return `Begin! Reminder to ALWAYS use the above format, and to use tools if appropriate.`
  }

  private async agentScratchpad() {
    return `Question: {input}
Thought: {agent_scratchpad}`
  }
}
