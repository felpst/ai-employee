import * as yup from 'yup';

export const addUserSchema = yup.object({
  body: yup
    .object({
      name: yup.string().required(),
      email: yup.string().required().email('Invalid email'),
      password: yup
        .string()
        .required()
        .min(6, 'Password must be at least 6 characters long')
        .matches(
          /^(?=.*[A-Z])(?=.*[!@#$&*.,])(?=.*[0-9])(?=.*[a-z]).{6,}$/,
          'The password must contain lowercase and uppercase letters, numbers and special characters (!@#$*.,)'
        ),
    })
    .noUnknown()
    .required(),
});

export const recoveryRequestSchema = yup.object({
  body: yup
    .object({
      email: yup.string().required().email('Invalid email'),
    })
    .noUnknown()
    .required(),
});

export const recoveryPasswordSchema = yup.object({
  body: yup
    .object({
      password: yup
        .string()
        .required()
        .min(6, 'Password must be at least 6 characters long')
        .matches(
          /^(?=.*[A-Z])(?=.*[!@#$&*.,])(?=.*[0-9])(?=.*[a-z]).{6,}$/,
          'The password must contain lowercase and uppercase letters, numbers and special characters (!@#$*.,)'
        ),
    })
    .noUnknown()
    .required(),
});

export type addUserSchemaType = yup.InferType<typeof addUserSchema>;
export type recoveryRequestSchemaType = yup.InferType<
  typeof recoveryRequestSchema
>;

export type recoveryPasswordSchemaType = yup.InferType<
  typeof recoveryPasswordSchema
>;
