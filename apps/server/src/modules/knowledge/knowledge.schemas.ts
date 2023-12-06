import { KnowledgeTypeEnum } from '@cognum/interfaces';
import * as yup from 'yup';

export const addKnowledgeSchema = yup.object({
  body: yup
    .object({
      title: yup.string().notRequired(),
      description: yup.string().notRequired(),
      data: yup
        .string()
        .when('type', {
          is: (type: KnowledgeTypeEnum) => type === KnowledgeTypeEnum.Document,
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
      contentUrl: yup
        .string()
        .url()
        .when('type', {
          is: (type: KnowledgeTypeEnum) => type !== KnowledgeTypeEnum.Document,
          then: (schema) => schema.required()
        }),
      htmlUpdateFrequency: yup.string().notRequired(),
      type: yup
        .string()
        .oneOf(Object.values(KnowledgeTypeEnum))
        .required(),
    })
    .noUnknown()
    .required(),
});

export type addKnowledgemaType = yup.InferType<typeof addKnowledgeSchema>;
