const sgMail = require('@sendgrid/mail')
const { sendgridAPIKey, frontend }= require('./../secrets')

sgMail.setApiKey(sendgridAPIKey)

const sendForgetPassword = (email, token) => {
  sgMail.send({
    to: email,
    from: 'noreply@arkenstone.ml',
    subject: 'Arkenstone Change Password',
    text: `Enter this to change your password: ${frontend}/reset-password/${token}`
  })
}

module.exports = {
  sendForgetPassword
} 
