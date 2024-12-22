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

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user.
 *         name:
 *           type: string
 *           description: The name of the user.
 *         email:
 *           type: string
 *           description: The email of the user.
 *         isEmailVerified:
 *           type: boolean
 *           description: Indicates if the user's email is verified.
 *         phone:
 *           type: number
 *           description: The phone number of the user.
 *         password:
 *           type: string
 *           description: The password of the user.
 *         role:
 *           type: string
 *           description: The role of the user.
 *         dob:
 *           type: string
 *           format: date
 *           description: The date of birth of the user.
 *         bio:
 *           type: string
 *           description: A brief bio of the user.
 *         tier:
 *           type: string
 *           description: The tier of the user.
 *         areaOfInterest:
 *           type: array
 *           items:
 *             type: string
 *           description: The areas of interest of the user.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the user was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the user was last updated.
 */
