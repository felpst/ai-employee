import { IAIEmployee, IAIEmployeeCall } from "@cognum/interfaces";
import { BehaviorSubject } from "rxjs";

export interface IBrowserlAgentOptions {
  $call: BehaviorSubject<IAIEmployeeCall>;
  instructions: string;
  context?: any;
  aiEmployee: IAIEmployee;
}

export interface IBrowserlAgentOutput {
  text: string;
}

export class BrowserAgent {

  async call(options: IBrowserlAgentOptions): Promise<IBrowserlAgentOutput> {

    return {
      text: 'Ok'
    }
  }

}
