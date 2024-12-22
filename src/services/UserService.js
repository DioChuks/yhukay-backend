const { StatusCodes } = require('http-status-codes')
const mongoose = require('mongoose')
const User = require('../models/User')
const ApiError = require('../errors/ApiError')

// Function to register a new user
const registerUser = async userBody => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already taken')
  }
  return User.create(userBody)
}

// Function to query users with pagination
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options)
  return users
}

// Function to get a user by ID
const getUserById = async id => User.findById(id)

// Function to get a user by email
const getUserByEmail = async email => User.findOne({ email })

// Function to update a user by ID
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId)
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already taken')
  }
  Object.assign(user, updateBody)
  await user.save()
  return user
}

// Function to delete a user by ID
const deleteUserById = async userId => {
  const user = await getUserById(userId)
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  }
  await user.deleteOne()
  return user
}

module.exports = {
  registerUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById
}
