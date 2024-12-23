const passport = require('passport')
const { StatusCodes, ReasonPhrases } = require('http-status-codes')
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
    console.log("decoded: "+decoded);
    const user = await User.findOne({ where: { decoded } })
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

const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.is_admin)) {
      return res.status(StatusCodes.FORBIDDEN).json({ error: ReasonPhrases.FORBIDDEN });
    }
    next();
  };
};


module.exports = { Gate, authorize }
