const { StatusCodes } = require('http-status-codes')
const catchAsync = require('../utils/catchAsync')
const userService = require('../services/UserService')
const tokenService = require('../services/TokenService')
const emailService = require('../services/EmailService')
const authService = require('../services/AuthService')

const register = catchAsync(async (req, res) => {
  const user = await userService.registerUser(req.body)
  const tokens = await tokenService.generateAuthTokens(user)
  res.status(StatusCodes.CREATED).send({ user, tokens })
})

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body
  const user = await authService.loginUserWithEmailAndPassword(email, password)
  const tokens = await tokenService.generateAuthTokens(user)
  res.send({ user, tokens })
})

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken)
  res.status(StatusCodes.NO_CONTENT).send()
})

const refreshTokens = catchAsync(async (req, res) => {
  const userWithTokens = await authService.refreshAuth(req.body.refreshToken)
  res.send({ ...userWithTokens })
})

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(
    req.body.email
  )
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken)
  res.status(StatusCodes.NO_CONTENT).send()
})

const forgotPasswordWithOtp = catchAsync(async (req, res) => {
    const otp = await authService.generateAndSendOTP(
    req.body.email
  )
  await emailService.sendResetPasswordEmailWithOtp(req.body.email, otp)
  res.status(StatusCodes.NO_CONTENT).send()
})

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query['token'], req.body.password)
  res.status(StatusCodes.NO_CONTENT).send()
})

const resetPasswordWithOtp = catchAsync(async (req, res) => {
  await authService.resetPasswordWithOTP(req.body.email, req.body.otp, req.body.password)
  res.status(StatusCodes.NO_CONTENT).send()
})

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.body)
  await emailService.sendVerificationEmailWithOtp(
    req.body.email,
    verifyEmailToken,
    req.body.name
  )
  res.status(StatusCodes.NO_CONTENT).send()
})

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query['token'])
  res.status(StatusCodes.NO_CONTENT).send()
})

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  forgotPasswordWithOtp,
  resetPassword,
  resetPasswordWithOtp,
  sendVerificationEmail,
  verifyEmail
}
