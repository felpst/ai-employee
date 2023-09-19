import * as yup from 'yup';

export const addUserSchema = yup.object({
  body: yup
    .object({
      name: yup.string().required(),
      email: yup.string().required().email('Invalid email'),
      password: yup
        .string()
        .required()
        .min(8, 'Password must be at least 8 characters long')
        .matches(
          /^(?=.*[A-Z])(?=.*[!@#$&*.,])(?=.*[0-9])(?=.*[a-z]).{8,}$/,
          'The password must contain lowercase and uppercase letters, numbers and special characters (!@#$*.,)'
        ),
    })
    .noUnknown()
    .required(),
});

export type addUserSchemaType = yup.InferType<typeof addUserSchema>;
