const nodemailer = require('nodemailer')
const config = require('../config/environment')
const logger = require('../log/logger')

const transport = nodemailer.createTransport(config.email.smtp)
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() =>
      logger.warn(
        'Unable to connect to email server. Make sure you have configured the SMTP options in .env'
      )
    )
}

const sendEmail = async (to, subject, text, html) => {
  const msg = {
    from: config.email.from,
    to,
    subject,
    text,
    html
  }
  await transport.sendMail(msg)
}

const sendResetPasswordEmailWithOtp = async (to, otp) => {
  const subject = 'Reset password'
  const text = `Hi,
  To reset your password, Use this OTP: ${otp}
  If you did not request any password resets, then ignore this email.`
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Dear user,</strong></h4>
  <p>To reset your password, Use this OTP: ${otp}</p>
  <p>If you did not request any password resets, please ignore this email.</p>
  <p>Thanks,</p>
  <p><strong>Yhukay DigitalOhms</strong></p></div>`
  await sendEmail(to, subject, text, html)
}

const sendVerificationEmailWithOtp = async (to, otp) => {
  const subject = 'Account Verification'
  const text = `To verify your account, use this OTP: ${otp}
  If you did not create an account, then ignore this email.`
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;">
  <p>To verify your account, use this OTP: ${otp}</p>
  <p>If you did not create an account, then ignore this email.</p></div>`
  await sendEmail(to, subject, text, html)
}

const sendAccountCreated = async (to) => {
  const subject = 'Account Created Successfully'
  // replace this url with the link to the email verification page of your front-end app
  const loginUrl = `${config.clientUrl}/auth/login`
  const text = `Congratulations! Your account has been created successfully.
  Open the mobile application continue
  Don't hesitate to contact us if you face any problems
  Regards,
  Team`
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;">
  <p>Congratulations! Your account has been created successfully.</p>
  <p>Open the mobile application continue</p>
  <p>Don't hesitate to contact us if you face any problems</p>
  <p>Regards,</p>
  <p><strong>Yhukay DigitalOhms</strong></p></div>`
  await sendEmail(to, subject, text, html)
}

module.exports = {
  sendAccountCreated,
  sendResetPasswordEmailWithOtp,
  sendVerificationEmailWithOtp
}
