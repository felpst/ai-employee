import * as yup from 'yup';

export const addKnowledgeSchema = yup.object({
  body: yup
    .object({
      title: yup.string().notRequired(),
      description: yup.string().notRequired(),
      data: yup.string().when('isFile', {
        is: (isFile: boolean) => !isFile,
        then: (schema) => schema.required()
      }),
      workspace: yup.string().required(),
      employees: yup.array().of(yup.string()).notRequired(),
      permissions: yup
        .array()
        .of(
          yup.object({
            userId: yup.string().required(),
            permission: yup.string().oneOf(['Reader', 'Editor']).required(),
          })
        )
        .notRequired(),
      fileUrl: yup.string().when('isFile', {
        is: (isFile: boolean) => isFile,
        then: (schema) => schema.required()
      }),
      isFile: yup.boolean().required(),
    })
    .noUnknown()
    .required(),
});

export type addKnowledgemaType = yup.InferType<typeof addKnowledgeSchema>;
