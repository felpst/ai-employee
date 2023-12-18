import { IAIEmployee } from '@cognum/interfaces';
import { triggers } from '@cognum/models';
import { model, models } from 'mongoose';
import { aiEmployeeCall } from './methods';
import { aiEmployeeCheckValidAnswer } from './methods/check-valid-answer';
import { aiEmployeeEmail } from './methods/email';
import { aiEmployeeMemoryInstruction } from './methods/memory-instruction';
import { aiEmployeeMemorySearch } from './methods/memory-search';
import { aiEmployeeSchema } from './schemas';

triggers(aiEmployeeSchema);

aiEmployeeSchema.methods.call = aiEmployeeCall;
aiEmployeeSchema.methods.memorySearch = aiEmployeeMemorySearch;
aiEmployeeSchema.methods.memoryInstruction = aiEmployeeMemoryInstruction;
aiEmployeeSchema.methods.checkValidAnswer = aiEmployeeCheckValidAnswer;
aiEmployeeSchema.methods.getEmail = aiEmployeeEmail;

const AIEmployee = models['AIEmployee'] || model<IAIEmployee>('AIEmployee', aiEmployeeSchema);
export { AIEmployee };

