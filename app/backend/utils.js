const IBAN = require('iban');

module.exports.checkPasswordLength = function (password, response){
  return (password.length < 6)
}

module.exports.checkIBAN = function(iban){
  return IBAN.isValid(iban)
}