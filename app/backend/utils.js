module.exports.checkPasswordLength = function (password, response){
  return (password.length < 6)
}