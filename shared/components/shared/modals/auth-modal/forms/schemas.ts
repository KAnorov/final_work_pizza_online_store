import Joi from 'joi';

// Базовая схема пароля
export const passwordSchema = Joi.string().min(4).message('Введите корректный пароль');

// Схема для входа
export const formLoginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .message('Введите корректную почту')
    .required(),
  password: passwordSchema,
});

// Типы (через Joi)
export type TFormLoginValues = {
  email: string;
  password: string;
};

export type TFormRegisterValues = TFormLoginValues & {
  fullName: string;
  confirmPassword: string;
};