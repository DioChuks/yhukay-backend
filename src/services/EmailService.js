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

const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password'
  const resetPasswordUrl = `${config.clientUrl}/reset-password?token=${token}`
  const text = `Hi,
  To reset your password, click on this link: ${resetPasswordUrl}
  If you did not request any password resets, then ignore this email.`
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Dear user,</strong></h4>
  <p>To reset your password, click on this link: ${resetPasswordUrl}</p>
  <p>If you did not request any password resets, please ignore this email.</p>
  <p>Thanks,</p>
  <p><strong>Mentor Tower</strong></p></div>`
  await sendEmail(to, subject, text, html)
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
  <p><strong>Mentor Tower</strong></p></div>`
  await sendEmail(to, subject, text, html)
}

const sendVerificationEmail = async (to, token, name) => {
  const subject = 'Email Verification'
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `${config.clientUrl}/verify-email?token=${token}`
  const text = `Hi ${name},
  To verify your email, click on this link: ${verificationEmailUrl}
  If you did not create an account, then ignore this email.`
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
  <p>To verify your email, click on this link: ${verificationEmailUrl}</p>
  <p>If you did not create an account, then ignore this email.</p></div>`
  await sendEmail(to, subject, text, html)
}

const sendVerificationEmailWithOtp = async (to, otp, name) => {
  const subject = 'Email Verification'
  const text = `Hi ${name},
  To verify your email, Use this OTP: ${otp}
  If you did not create an account, then ignore this email.`
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
  <p>To verify your email, Use this OTP: ${otp}</p>
  <p>If you did not create an account, then ignore this email.</p></div>`
  await sendEmail(to, subject, text, html)
}

const sendSuccessfulRegistration = async (to, token, name) => {
  const subject = 'Email Verification'
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `${config.clientUrl}/verify-email?token=${token}`
  const text = `Hi ${name},
  Congratulations! Your account has been created.
  You are almost there. Complete the final step by verifying your email at: ${verificationEmailUrl}
  Don't hesitate to contact us if you face any problems
  Regards,
  Mentor Tower`
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
  <p>Congratulations! Your account has been created.</p>
  <p>You are almost there. Complete the final step by verifying your email at: ${verificationEmailUrl}</p>
  <p>Don't hesitate to contact us if you face any problems</p>
  <p>Regards,</p>
  <p><strong>Mentor Tower</strong></p></div>`
  await sendEmail(to, subject, text, html)
}

const sendAccountCreated = async (to, name) => {
  const subject = 'Account Created Successfully'
  // replace this url with the link to the email verification page of your front-end app
  const loginUrl = `${config.clientUrl}/auth/login`
  const text = `Hi ${name},
  Congratulations! Your account has been created successfully.
  Open the mobile application continue
  Don't hesitate to contact us if you face any problems
  Regards,
  Team`
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
  <p>Congratulations! Your account has been created successfully.</p>
  <p>Open the mobile application continue</p>
  <p>Don't hesitate to contact us if you face any problems</p>
  <p>Regards,</p>
  <p><strong>Mentor Tower</strong></p></div>`
  await sendEmail(to, subject, text, html)
}

module.exports = {
  sendSuccessfulRegistration,
  sendAccountCreated,
  sendResetPasswordEmail,
  sendResetPasswordEmailWithOtp,
  sendVerificationEmail,
  sendVerificationEmailWithOtp
}
