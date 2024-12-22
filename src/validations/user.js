const Joi = require('joi')

const userDetails = {
    name: Joi.string(),
    areaOfInterest: Joi.array(),
    bio: Joi.string(),
    phone: Joi.number(),
    dob: Joi.string(),
}

const validateUpdateUser = {
    body: Joi.object().keys(userDetails)
}

module.exports = {
  validateUpdateUser
}
