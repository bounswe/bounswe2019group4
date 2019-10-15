const IBAN = require('iban');
const commonPassword = require('common-password');
const {Event} = require('./models/event');
const request = require('request');
const url = "https://api.tradingeconomics.com/calendar/country/all?c=guest:guest";

/*
  Method in order to check whether password is valid or not.
  Password length must be at least 6 and also,
  password must not be easy to guess.
*/
module.exports.checkPassword = function (password){
  if(password.length < 6)
    return false;

  return !(commonPassword(password))
}

/*
  Method in order to check whether IBAN is valid or not.
*/
module.exports.checkIBAN = function(iban){
  return IBAN.isValid(iban)
}

/*
  Method in order to check whether TCKN is valid or not.
  TCKN length must be 11.
  Sum of first 10 digits mode 10 must be equals to 11th digit.
  And 10th digit is tested using TCKN test. 
*/
module.exports.checkTCKN = function(value) {
  value = value.toString();
  
  var isEleven = /^[0-9]{11}$/.test(value);

  var totalOdds = 0;
  var totalEvens = 0;
  
  for (var i = 0; i < 10; i++) {
    if(i%2 == 0)
      totalOdds += Number(value.substr(i, 1));

    else
      totalEvens += Number(value.substr(i, 1));
  }
  
  var tenthDigitSatisfied = ((totalOdds * 7) - totalEvens) % 10 == value.substr(9,0);
  var total10 = 0;
  for (var i = 0; i < 10; i++) {
    total10 += Number(value.substr(i, 1));
  }

  var lastDigitSatisfied = total10 % 10 == value.substr(10,1);
  
  return isEleven && lastDigitSatisfied && tenthDigitSatisfied;
};

/*
  Get method for events.
  Using 3rd party API, it saves events to database.
*/
module.exports.getEventsFromAPI = function() {

  request(url, (error, response, body) => {
    // If there is an error
    if(error){
      return
    }

    // If there is no error, returns event lists 
    else{
      const events = JSON.parse(body);
            
      events.forEach((ev) => {
        let event = new Event({
          ...ev
        });

        event.save().then(doc => {
          
        }).catch(err => {
          
        });
      });
    }

  })
}