const sgMail = require('@sendgrid/mail')
const { senderEmail, sendgridAPIKey, frontend }= require('./../secrets')

sgMail.setApiKey(sendgridAPIKey)

const sendForgetPassword = (email, token) => {
  sgMail.send({
    to: email,
    from: senderEmail,
    subject: 'Arkenstone Change Password',
    text: `Enter this to change your password: ${frontend}/reset-password/${token}`
  })
}

module.exports = {
  sendForgetPassword
} 
