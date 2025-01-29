import * as yup from 'yup';

export const addEmployeeSchema = yup.object({
  body: yup
    .object({
      name: yup.string().required(),
      role: yup.string().required(),
      avatar: yup.string().notRequired(),
      workspace: yup.string().notRequired(),
    })
    .noUnknown()
    .required(),
});

export type addEmployeeSchemaType = yup.InferType<typeof addEmployeeSchema>;
