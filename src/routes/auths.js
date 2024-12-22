const express = require("express");
const validate = require("../validations/validate/object");
const authValidation = require("../validations/auth");
const { IsAuth } = require("../middlewares/auth");

const authController = require("../controllers/AuthController");

const router = express.Router();

router.post(
  "/register",
  validate(authValidation.register),
  authController.register
);
router.post("/login", validate(authValidation.login), authController.login);
router.post("/logout", validate(authValidation.logout), authController.logout);
router.post(
  "/refresh-tokens",
  validate(authValidation.refreshTokens),
  authController.refreshTokens
);
router.post(
  "/forgot-password",
  validate(authValidation.forgotPassword),
  authController.forgotPasswordWithOtp
);
router.post(
  "/reset-password",
  validate(authValidation.resetPassword),
  authController.resetPasswordWithOtp
);
router.post(
  "/send-verification-email",
  IsAuth(),
  authController.sendVerificationEmail
);
router.post(
  "/verify-email",
  validate(authValidation.verifyEmail),
  authController.verifyEmail
);

module.exports = router;
