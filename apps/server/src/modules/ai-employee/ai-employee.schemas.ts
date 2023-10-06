import * as yup from 'yup';

export const addEmployeeSchema = yup.object({
  body: yup
    .object({
      name: yup.string().required(),
      role: yup.string().required(),
      workspaces: yup.array().of(yup.string()).notRequired().defined(),
    })
    .noUnknown()
    .required(),
});

export type addEmployeeSchemaType = yup.InferType<typeof addEmployeeSchema>;
