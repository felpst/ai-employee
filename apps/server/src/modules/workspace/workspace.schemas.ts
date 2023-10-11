import * as yup from 'yup';

export const addWorkspace = yup.object({
  body: yup
    .object({
      name: yup.string().required(),
      description: yup.string().notRequired().defined(),
      profilePhoto: yup.string().notRequired(),
      accessLink: yup.string().notRequired(),
      private: yup.bool().notRequired(),
      users: yup.array().of(yup.string()).notRequired().defined(),
    })
    .noUnknown()
    .required(),
});

export type addWorkspaceType = yup.InferType<typeof addWorkspace>;
