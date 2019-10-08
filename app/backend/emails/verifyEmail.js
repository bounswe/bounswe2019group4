const sgMail = require('@sendgrid/mail')
const { sendgridAPIKey, website }= require('./../secrets')

sgMail.setApiKey(sendgridAPIKey)

const sendVerifyEmail = (email, token) => {
  sgMail.send({
    to: email,
    from: 'noreply@arkenstone.ml',
    subject: 'Arkenstone Email Verification',
    text: `Enter this to verify your email: ${website}/auth/verify?token=${token}`,
  })
}
module.exports = {
 sendVerifyEmail
}