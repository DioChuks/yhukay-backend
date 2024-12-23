const jwt = require('jsonwebtoken')

const jwtSign = (cake) => {
  const accessToken = jwt.sign(cake, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION || '1d'
  })

  return { accessToken }
}

const jwtVerify = ({ accessToken }) => {
  return jwt.verify(accessToken, process.env.JWT_SECRET)
}

class jwtError extends jwt.JsonWebTokenError {
  constructor(message) {
    super(message)
    this.name = 'jwtError'
  }
}

class tokenError extends jwt.TokenExpiredError {
    constructor(message) {
        super(message)
        this.name = 'tokenError'
    }
}

module.exports = { jwtError, jwtVerify, jwtSign, tokenError }
