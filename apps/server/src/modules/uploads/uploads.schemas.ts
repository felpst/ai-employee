import * as yup from 'yup';

export const singleUpload = yup.object({
  body: yup
    .object({
      folder: yup.string().required(),
      parentId: yup.string().notRequired(),
      filename: yup.string().notRequired(),
    })
    .noUnknown()
    .required(),
});

export type singleUploadType = yup.InferType<typeof singleUpload>;
