import * as yup from 'yup';

export const addKnowledgeSchema = yup.object({
  body: yup
    .object({
      title: yup.string().notRequired(),
      description: yup.string().notRequired(),
      data: yup.string().required(),
      workspace: yup.string().required(),
      employees: yup.array().of(yup.string()).notRequired(),
    })
    .noUnknown()
    .required(),
});

export type addKnowledgemaType = yup.InferType<typeof addKnowledgeSchema>;
