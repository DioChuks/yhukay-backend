const { StatusCodes } = require('http-status-codes')
const mongoose = require('mongoose')
const Token = require('../models/Token')
const ApiError = require('../errors/ApiError')
const tokenTypes = require('../contracts/tokens')
const { getUserByEmail, getUserById, updateUserById } = require('./UserService')
const { generateAuthTokens, verifyToken } = require('./TokenService')
const crypto = require('crypto')

const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await getUserByEmail(email)
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Incorrect email or password')
  }
  return user
}

const logout = async refreshToken => {
  const refreshTokenDoc = await Token.findOne({
    token: refreshToken,
    type: tokenTypes.REFRESH,
    blacklisted: false
  })
  if (!refreshTokenDoc) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Not found')
  }
  await refreshTokenDoc.deleteOne()
}

const refreshAuth = async refreshToken => {
  try {
    const refreshTokenDoc = await verifyToken(refreshToken, tokenTypes.REFRESH)
    const user = await getUserById(
      new mongoose.Types.ObjectId(refreshTokenDoc.user)
    )
    if (!user) {
      throw new Error()
    }
    await refreshTokenDoc.deleteOne()
    const tokens = await generateAuthTokens(user)
    return { user, tokens }
  } catch (error) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Please authenticate')
  }
}

const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await verifyToken(
      resetPasswordToken,
      tokenTypes.RESET_PASSWORD
    )
    const user = await getUserById(
      new mongoose.Types.ObjectId(resetPasswordTokenDoc.user)
    )
    if (!user) {
      throw new Error()
    }
    await updateUserById(user.id, { password: newPassword })
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD })
  } catch (error) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Password reset failed')
  }
}

const verifyEmail = async verifyEmailToken => {
  try {
    const verifyEmailTokenDoc = await verifyToken(
      verifyEmailToken,
      tokenTypes.VERIFY_EMAIL
    )
    const user = await getUserById(
      new mongoose.Types.ObjectId(verifyEmailTokenDoc.user)
    )
    if (!user) {
      throw new Error()
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL })
    const updatedUser = await updateUserById(user.id, { isEmailVerified: true })
    return updatedUser
  } catch (error) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Email verification failed')
  }
}

// Generate random OTP
const generateOTP = () => {
    return crypto.randomInt(10000, 99999).toString(); // Generates a 5-digit OTP
}

// Reset password using OTP
const resetPasswordWithOTP = async (email, otp, newPassword) => {
    const user = await getUserByEmail(email);
    if (!user || user.otp !== otp) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid OTP');
    }

    await updateUserById(user.id, { password: newPassword, otp: null }); // Reset the password and clear the OTP
}

  // Generate OTP and send it to the user's email
const generateAndSendOTP = async (email) => {
    const user = await getUserByEmail(email);
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }

    const otp = generateOTP();
    await updateUserById(user.id, { otp }); // Save the OTP in the user's record

    return otp;
}

  // Verify the OTP (optional if needed separately)
const verifyOTP = async (email, otp) => {
    const user = await getUserByEmail(email);
    if (!user || user.otp !== otp) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid OTP');
    }

    return true; // OTP is valid
}

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  verifyEmail,
  resetPassword,
  refreshAuth,
  resetPasswordWithOTP,
  generateAndSendOTP,
  verifyOTP
}
