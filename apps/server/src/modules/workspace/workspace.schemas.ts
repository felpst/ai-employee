import * as yup from 'yup';

export const addWorkspace = yup.object({
  body: yup
    .object({
      name: yup.string().required(),
      description: yup.string().notRequired().defined(),
      workspacePhoto: yup.string().notRequired(),
      accessLink: yup.string().notRequired(),
      private: yup.bool().notRequired(),
      users: yup.array().of(yup.string()).notRequired(),
      usersEmails: yup.array().of(yup.string()).notRequired(),
      employee: yup
        .object({
          name: yup.string().required(),
          role: yup.string().required(),
          avatar: yup.string().notRequired(),
        })
        .notRequired()
        .nullable(),
    })
    .noUnknown()
    .required(),
});

export type addWorkspaceType = yup.InferType<typeof addWorkspace>;
