const sgMail = require('@sendgrid/mail')
const { senderEmail, sendgridAPIKey, frontend }= require('./../secrets')

sgMail.setApiKey(sendgridAPIKey)

const sendVerifyEmail = (email, token) => {
  sgMail.send({
    to: email,
    from: senderEmail,
    subject: 'Arkenstone Email Verification',
    text: `Enter this to verify your email: ${frontend}/verify/${token}`,
  })
}
module.exports = {
 sendVerifyEmail
}
