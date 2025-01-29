import { IAIEmployeeCall } from '@cognum/interfaces';
import { triggers } from '@cognum/models';
import { model, models } from 'mongoose';
import { run } from './methods/run.method';
import { aiEmployeeCallSchema } from './schemas/call.schema';

triggers(aiEmployeeCallSchema);
aiEmployeeCallSchema.methods.run = run;

const AIEmployeeCall = models['AIEmployeeCall'] || model<IAIEmployeeCall>('AIEmployeeCall', aiEmployeeCallSchema);
export { AIEmployeeCall };

