export interface ITool {
  id: string;
  name: string;
  description: string;
  icon: string;
  intentions?: string[];
  show: boolean;
}

export interface IToolSettings {
  id: string;
  options?: any;
}
