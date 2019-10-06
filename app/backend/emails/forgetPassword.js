const sgMail = require('@sendgrid/mail')
const { sendgridAPIKey }= require('./../secrets')

sgMail.setApiKey(sendgridAPIKey)

const sendForgetPassword = (email, token) => {sgMail.send({
   to: email,
   from: 'noreplyarkenstone@gmail.com',
   subject: 'Arkenstone Change Password',
   text: 'Enter this to change your password: localhost:8080/auth/reset-password?token=' + token
 })
}

module.exports = {
 sendForgetPassword
} 