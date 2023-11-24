export interface ITool {
  name: string;
  description: string;
  icon: string;
  fields: string[];
}

export interface IToolSettings {
  name: string;
  options?: any;
}
