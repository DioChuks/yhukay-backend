const { StatusCodes } = require('http-status-codes')
const catchAsync = require('../utils/catchAsync')
const userService = require('../services/UserService')

const getUserProfile = catchAsync(async (req, res) => {
    const user = await userService.getUserById(req.params.userId);
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }
    res.status(200).json(user)
})

const updateUserData = catchAsync(async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Parameters expected!');
    }
    const updatedUser = await userService.updateUserById(req.params.userId, req.body);
    res.status(200).json(updatedUser)
})

module.exports = {
    getUserProfile,
    updateUserData
}