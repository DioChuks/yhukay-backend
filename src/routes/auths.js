const express = require("express");
const { StatusCodes, ReasonPhrases } = require('http-status-codes')
const bcrypt = require('bcrypt');
const User = require("../models/User");
const { generateOTP } = require("../utils/otp");
const { sendVerificationEmailWithOtp } = require("../services/EmailService");
const { jwtSign } = require("../utils/jwt");

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { phone, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(StatusCodes.CONFLICT).json({ error: ReasonPhrases.CONFLICT });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    // Create user with OTP (email not verified yet)
    await User.create({
      email,
      phone,
      password: hashedPassword,
      email_verified_at: null,
      otp,
    });

    await sendVerificationEmailWithOtp(email, otp);

    res.status(StatusCodes.CREATED).json({ message: ReasonPhrases.CREATED });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
});

router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(StatusCodes.NOT_FOUND).json({ error: ReasonPhrases.NOT_FOUND });

    const otp = generateOTP();
    user.otp = otp;
    await user.save();

    await sendVerificationEmailWithOtp(email, otp);

    res.status(StatusCodes.OK).json({ message: ReasonPhrases.OK });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
});


router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(StatusCodes.NOT_FOUND).json({ error: ReasonPhrases.NOT_FOUND });

    if (user.otp !== otp) return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid OTP' });

    // Update email_verified_at and clear OTP
    user.email_verified_at = new Date();
    user.otp = null;
    await user.save();

    res.status(StatusCodes.OK).json({ message: ReasonPhrases.OK });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(StatusCodes.NOT_FOUND).json({ error: ReasonPhrases.NOT_FOUND });

    // if (!user.email_verified_at) return res.status(400).json({ error: 'Email not verified' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwtSign({ id: user.id, email: user.email, is_admin: user.is_admin }).accessToken;

    res.status(StatusCodes.OK).json({ message: ReasonPhrases.OK, user, token });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
});

module.exports = router;
