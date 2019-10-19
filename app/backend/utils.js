const IBAN = require('iban');
const commonPassword = require('common-password');
const {Event} = require('./models/event');
const {TradingEquipment} = require('./models/trading-eq');
const request = require('request');
const url = "https://api.tradingeconomics.com/calendar/country/all?c=guest:guest";
let trading_eq_url_base = "https://www.alphavantage.co/query?";
const { tradingEquipmentKey } = require('./secrets');
var fs = require("fs");
const until_day = "2019-07-01";
const waitFor = (ms) => new Promise(r => setTimeout(r, ms));


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

/*
  Get method for Trading Equipments.
  Using 3rd party API, it saves trading equipments to database.
*/
module.exports.getTradingEquipmentsFromAPI = function(isOnlyToday) {

  // read currencies from file
  fs.readFile('./currencies.txt', 'utf8', function(err, contents) {
    let currencies = contents.split('\n'); // form an array consist of currencies
    func = "FX_DAILY"
    const start = async () => {
      await asyncForEach(currencies, async (currency) => {
        await waitFor(13*1000)                  // wait 13 second to complete. Because the limit is 5 request per minute
        from_symbol = currency.split(',')[0]    // currency code
        name = currency.split(',')[1]           // currency name
        if(!from_symbol)
         return
  
        // Take the USD value for every currency except USD. Take EUR value for USD.
        if(from_symbol == 'EUR')
          to_symbol = 'USD'
        else
          to_symbol = 'EUR'
  
        // form the request url
        let trading_eq_url = trading_eq_url_base + "function=" + func + "&from_symbol="+from_symbol+"&to_symbol="+to_symbol+"&apikey="+tradingEquipmentKey;
        
        // make the request
        await request(trading_eq_url, (error, response, body) => {
          // If there is an error
          if(error){
            console.log(error)
            return
          }
      
          else{
            const obj = JSON.parse(body);
            
            // get te time series from the json
            let time_series = obj["Time Series FX (Daily)"];
            var currentDay = new Date();
            var day_format = currentDay.toISOString().slice(0,10); // yyyy-mm-dd
  
            // save all the days until until_day
            while(time_series && day_format >= until_day){
  
              let temp = time_series[day_format];
  
              // if there is no info for the currency day, continue with the previous day
              if(!temp){
                currentDay.setDate(currentDay.getDate()-1);
                day_format = currentDay.toISOString().slice(0,10);
                continue;
              }
              
              // construct the equipment
              let trading_eq = new TradingEquipment({
                _id: {code: from_symbol, Date: day_format},
                code : from_symbol,
                name : name,
                open : temp["1. open"],
                high : temp["2. high"],
                low : temp["3. low"],
                close : temp["4. close"],
                value : to_symbol,
                Date : day_format
              });
                        
              // set current day as previous day
              currentDay.setDate(currentDay.getDate()-1);
              day_format = currentDay.toISOString().slice(0,10);
  
              // save the equipment
              trading_eq.save().then(doc => {
                
              }).catch(err => {
                //console.log(err);
              });

              if(isOnlyToday)
                break;
            }
          }
        });
      });
    }
    start();
  })
  
}

// async for each funtion
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}