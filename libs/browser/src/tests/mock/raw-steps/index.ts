export * from './linkedin';
export * from './xandr';

export interface IntermediateSteps extends Array<{
  action: {
    tool: string;
    toolInput: string | object;
    log: string;
  },
  observation: string;
}> { }