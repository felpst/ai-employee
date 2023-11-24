export interface ITool {
  id: string;
  name: string;
  description: string;
  icon: string;
  fields: string[];
}

export interface IToolSettings {
  id: string;
  options?: any;
}
