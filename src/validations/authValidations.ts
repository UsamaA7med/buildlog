import Joi from 'joi'

export const registerBodyValidation = Joi.object({
  fullname: Joi.string(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required(),
  role: Joi.string().required(),
})

export const loginBodyValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})
