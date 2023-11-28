<<<<<<< HEAD
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema } from 'mongoose';
import { DefaultModel } from './default.model';
import { IToolSettings } from './tool.interface';
=======
import { Schema } from 'mongoose';
import { DefaultModel } from './default.model';
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe
import { IWorkspace } from './workspace.interface';

export interface IAIEmployee extends DefaultModel {
  name: string;
  role: string;
  avatar?: string;
  workspace: Schema.Types.ObjectId | IWorkspace;
<<<<<<< HEAD
  tools: IToolSettings[];
=======
  tools: string[];
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe
}
