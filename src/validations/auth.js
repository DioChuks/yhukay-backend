const Joi = require('joi')
const { password } = require('./validate/custom')

const registerBody = {
  name: Joi.string().required(),
  email: Joi.string().required().email(),
  password: Joi.string().required().custom(password),
  role: Joi.string()
}

const register = {
  body: Joi.object().keys(registerBody)
}

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required()
  })
}

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required()
  })
}

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required()
  })
}

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required()
  })
}

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required()
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password)
  })
}

const resetPasswordWithOtp = {
  query: Joi.object().keys({
    otp: Joi.string().required()
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password)
  })
}

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required()
  })
}

const validateUpdateUserDetails = {
    name: Joi.string().required(),
    password: Joi.string().required().custom(password),
    areaOfInterest: Joi.string().required(),
    bio: Joi.string().required(),
    phone: Joi.number().required(),
    dob: Joi.string(),
  }

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  resetPasswordWithOtp,
  verifyEmail,
  validateUpdateUserDetails
}
