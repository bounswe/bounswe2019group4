module.exports.checkPasswordLength = function (password, response){
  if(password.length < 6){
    response.status(400).send({ errmsg: 'Password length must be at least 6.' })
  }
}