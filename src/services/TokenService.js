const jwt = require('jsonwebtoken')
const moment = require('moment')
const mongoose = require('mongoose')
const { StatusCodes } = require('http-status-codes')
const config = require('../config/appConfig')
const Token = require('../models/Token')
const ApiError = require('../errors/ApiError')
const _tokenTypes = require('../contracts/tokens')
const { userService } = require('./UserService')

// Function to generate a token
const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type
  }
  return jwt.sign(payload, secret)
}

// Function to save a token
const saveToken = async (token, userId, expires, type, blacklisted = false) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted
  })
  return tokenDoc
}

// Function to verify a token
const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, config.jwt.secret)
  if (typeof payload.sub !== 'string') {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'bad user')
  }
  const tokenDoc = await Token.findOne({
    token,
    type,
    user: payload.sub,
    blacklisted: false
  })
  if (!tokenDoc) {
    throw new Error('Token not found')
  }
  return tokenDoc
}

// Function to generate authentication tokens
const generateAuthTokens = async user => {
  const accessTokenExpires = moment().add(
    config.jwt.accessExpirationMinutes,
    'minutes'
  )
  const accessToken = generateToken(
    user.id,
    accessTokenExpires,
    _tokenTypes.ACCESS
  )

  const refreshTokenExpires = moment().add(
    config.jwt.refreshExpirationDays,
    'days'
  )
  const refreshToken = generateToken(
    user.id,
    refreshTokenExpires,
    _tokenTypes.REFRESH
  )
  await saveToken(
    refreshToken,
    user.id,
    refreshTokenExpires,
    _tokenTypes.REFRESH
  )

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate()
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate()
    }
  }
}

// Function to generate a reset password token
const generateResetPasswordToken = async email => {
  const user = await userService.getUserByEmail(email)
  if (!user) {
    throw new ApiError(StatusCodes.NO_CONTENT, '')
  }
  const expires = moment().add(
    config.jwt.resetPasswordExpirationMinutes,
    'minutes'
  )
  const resetPasswordToken = generateToken(
    user.id,
    expires,
    _tokenTypes.RESET_PASSWORD
  )
  await saveToken(
    resetPasswordToken,
    user.id,
    expires,
    _tokenTypes.RESET_PASSWORD
  )
  return resetPasswordToken
}

// Function to generate a verify email token
const generateVerifyEmailToken = async user => {
  const expires = moment().add(
    config.jwt.verifyEmailExpirationMinutes,
    'minutes'
  )
  const verifyEmailToken = generateToken(
    user.id,
    expires,
    _tokenTypes.VERIFY_EMAIL
  )
  await saveToken(verifyEmailToken, user.id, expires, _tokenTypes.VERIFY_EMAIL)
  return verifyEmailToken
}

module.exports = {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken
}
