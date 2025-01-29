import * as yup from 'yup';

export const addJobSchema = yup.object({
  body: yup
    .object({
      name: yup.string().required(),
      description: yup.string().required(), 
      instructions: yup.string().required(),
      frequency: yup.string(), 
      status: yup.string().required().oneOf(['running', 'done']),
      aiEmployee: yup.string().required()
    })
    .noUnknown()
    .required(),
});

export type addJobmaType = yup.InferType<typeof addJobSchema>;