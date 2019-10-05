const sgMail = require('@sendgrid/mail')
const { sendgridAPIKey }= require('./../secrets')

sgMail.setApiKey(sendgridAPIKey)

const sendVerifyEmail = (email, token) => {sgMail.send({
   to: email,
   from: 'noreplyarkenstone@gmail.com',
   subject: 'Arkenstone Email Verification',
   text: 'Enter this to verify your email: localhost:8080/auth/verify?token=' + token
 })
}
module.exports = {
 sendVerifyEmail
}