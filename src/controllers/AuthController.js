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

module.exports = {
  register,
  login,
  logout,
}
