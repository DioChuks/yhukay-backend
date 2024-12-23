const passport = require('passport')
const { StatusCodes, ReasonPhrases } = require('http-status-codes')
const ApiError = require('../errors/ApiError')
const { jwtError, jwtVerify, tokenError } = require('../utils/jwt')
const getAccessTokenFromHeaders = require('../utils/headers')
const User = require('../models/User')

const Gate = async (req, res, next) => {
  try {
    const { accessToken } = getAccessTokenFromHeaders(req.headers)

    if (!accessToken) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'No token provided!',
        status: StatusCodes.UNAUTHORIZED
        })
    }

    const decoded = jwtVerify({accessToken})
    const user = await User.findById(decoded.sub)
    console.log("user: "+user);

    if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'No tokenable id!',
            status: StatusCodes.UNAUTHORIZED
        })
    }

    req.user = user
  } catch(err) {
    console.log('process failed at middleware', err)
    if (err instanceof jwtError) {
        return res.status(StatusCodes.FORBIDDEN).json({
          message: err.message,
          status: StatusCodes.FORBIDDEN
        })
    }
    if (err instanceof tokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: err.message,
            status: StatusCodes.BAD_REQUEST
        })
    }
  }

  return next()
}

module.exports = { Gate }
