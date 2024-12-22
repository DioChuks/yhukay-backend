const express = require('express')
const validate = require('../validations/validate/object')
const userValidation = require('../validations/user')
const { GateRoute } = require('../middlewares/auth')

const userController = require('../controllers/UserController')

const router = express.Router()
router.use(GateRoute);

router.patch(
  '/:userId',
  validate(userValidation.validateUpdateUser),
  userController.updateUserData
)

router.get('/:userId', userController.getUserProfile)

module.exports = router

