var fs = require("fs");
const IBAN = require('iban');
const commonPassword = require('common-password');
const request = require('request');
const levenstein = require('leven')
const schedule = require('node-schedule');

const {UserFollow} = require('./models/user-follow')
const {User} = require('./models/user')
const {Event} = require('./models/event');
const {TradingEquipment} = require('./models/trading-eq');
const {TradingEquipmentPrediction} = require('./models/trading-eq-prediction');
const {Comment} = require('./models/comment');
const {Article} = require('./models/article');
const {CurrentTradingEquipment} = require('./models/current-trading-eq');
const {OrderInvestment} = require('./models/order-investment');
const { UserAccount } = require('./models/user-account');
const { InvestmentHistory } = require('./models/investment-history');
const { tradingEquipmentKey } = require('./secrets');

const url = "https://api.tradingeconomics.com/calendar/country/all?c=guest:guest";
let trading_eq_url_base = "https://www.alphavantage.co/query?";
const until_day = "2019-01-01";

const waitFor = (ms) => new Promise(r => setTimeout(r, ms));


module.exports.scheduleAPICalls = function(){
  /*
  Get method for events in every 30 minutes
  */
  getEventsFromAPI

  /*
  Get method for trading equipments every day
  */
  getTradingEquipmentsFromAPI

  /*
  Get method for current trading equipments values in every two hours
  */
  getCurrentTradingEquipmentsFromAPI
  
  /*
  Result prediction method that find results every 2 hours.
  */
  resultPredictions
  
  /*
  Handle investment orders method that handles every 2 hours.
  */
  handleInvestmentOrders

  /*
  Get method for coins every day
  */
  getCoinsFromAPI
}

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
getEventsFromAPI = schedule.scheduleJob('*/30 * * * *', function() {
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
});

/*
  Get method for Currency Trading Equipments.
  Using 3rd party API, it saves currencies to database.
*/
getTradingEquipmentsFromAPI = schedule.scheduleJob('0 23 * * *', function() {
  isOnlyToday = true
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
        let trading_eq_url = trading_eq_url_base + "function=" + func + "&from_symbol="+from_symbol+"&to_symbol="+to_symbol+"&outputsize=full&apikey="+tradingEquipmentKey;
        
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
});

/*
  Get method for Currency Trading Equipments.
  Using 3rd party API, it saves current currency values to database.
*/
getCurrentTradingEquipmentsFromAPI = schedule.scheduleJob('0 */2 * * *', async function() {
  // read currencies from file
  fs.readFile('./currencies.txt', 'utf8', function(err, contents) {
    let currencies = contents.split('\n'); // form an array consist of currencies
    func = "CURRENCY_EXCHANGE_RATE"
    const start = async () => {
      await asyncForEach(currencies, async (currency) => {
        await waitFor(13*1000)                  // wait 13 second to complete. Because the limit is 5 request per minute
        from_symbol = currency.split(',')[0]    // currency code
        from_name = currency.split(',')[1]    // currency name
        
        if(!from_symbol)
         return
  
        // Take the USD value for every currency except USD. Take EUR value for USD.
        if(from_symbol == 'EUR'){
          to_symbol = 'USD'
          to_name = 'United States Dollar'    // currency name
        }
        else{
          to_symbol = 'EUR'
          to_name = 'EURO'    // currency name
        }
  
        // form the request url
        let trading_eq_url = trading_eq_url_base + "function=" + func + "&from_currency="+from_symbol+"&to_currency="+to_symbol+"&apikey="+tradingEquipmentKey;
        // make the request
        await request(trading_eq_url, async (error, response, body) => {
          // If there is an error
          if(error){
            console.log(error)
            return
          }
          else{
            const obj = JSON.parse(body);
            let result = obj["Realtime Currency Exchange Rate"];
            if(result){
              await CurrentTradingEquipment.findOne({ from : from_symbol}, function(err, teq){
                if(!teq){
                  teq = new CurrentTradingEquipment({
                    from : from_symbol,
                    fromName : from_name,
                    to : to_symbol,
                    toName : to_name
                  });
                }

                teq.rate = result['5. Exchange Rate'];
                teq.Date = result['6. Last Refreshed'];

                teq.save().then(doc => {
                  
                }).catch(err => {
                  //console.log(err);
                });
              });
            }
          }
        });
      });
    }
    start();
  })
});

handleInvestmentOrders = schedule.scheduleJob('4 */2 * * *', async function() {
  orders = await OrderInvestment.find({})

  for(i = 0; i < orders.length; i++){
    let RELATED_TEQ = orders[i].currency
    let RATE = orders[i].rate
    let COMPARE = orders[i].compare
    let AMOUNT = orders[i].amount
    let TYPE = orders[i].type
    let USER_ID = orders[i].userId
    let ORDER_ID = orders[i]._id

    currentExchange = await CurrentTradingEquipment.findOne({from : RELATED_TEQ})
    if(currentExchange.rate >= RATE && COMPARE == "HIGHER"){
      if(TYPE == "BUY"){
        buyEquipment(ORDER_ID, USER_ID, currentExchange.rate, RELATED_TEQ, AMOUNT)
      } else if(TYPE == "SELL"){
        sellEquipment(ORDER_ID, USER_ID, currentExchange.rate, RELATED_TEQ, AMOUNT)
      }
    } else if(currentExchange.rate <= RATE && COMPARE == "LOWER"){
      if(TYPE == "BUY"){
        buyEquipment(ORDER_ID, USER_ID, currentExchange.rate, RELATED_TEQ, AMOUNT)
      } else if(TYPE == "SELL"){
        sellEquipment(ORDER_ID, USER_ID, currentExchange.rate, RELATED_TEQ, AMOUNT)
      }
    }
  }
});

async function buyEquipment(ORDER_ID, USER_ID, RATE, TEQ, AMOUNT){
  OrderInvestment.deleteOne({_id: ORDER_ID, userId: USER_ID}, (err, results) => {
    if(err){
      console.log(err)
    }
  })

  row = await UserAccount.findOne({userId : USER_ID})
  if(!row){
    return;
  }

  let EUR_AMOUNT = row['EUR']
  let TEQ_AMOUNT = row[TEQ]

  let DECREASE_EUR = RATE * AMOUNT

  let FINAL_EUR = EUR_AMOUNT - DECREASE_EUR
  let FINAL_TEQ = TEQ_AMOUNT + AMOUNT

  if(FINAL_EUR < 0){
    return;
  }

  UserAccount.updateOne({userId: USER_ID, [TEQ]: FINAL_TEQ, 'EUR': FINAL_EUR}).then(async doc => {
    let history = new InvestmentHistory({
      userId: USER_ID,
      text: AMOUNT + " " + TEQ+ " bougth.",
      date: new Date()
    })

    history.save().then(doc => {

    }).catch(error => {
      console.log(error)
    })
    }).catch(error => {
      console.log(error)
  })
}

async function sellEquipment(ORDER_ID, USER_ID, RATE, TEQ, AMOUNT){
  OrderInvestment.deleteOne({_id: ORDER_ID, userId: USER_ID}, (err, results) => {
    if(err){
      console.log(err)
    }
  })

  row = await UserAccount.findOne({userId : USER_ID})
  if(!row){
    return;
  }

  let EUR_AMOUNT = row['EUR']
  let TEQ_AMOUNT = row[TEQ]

  if(AMOUNT > TEQ_AMOUNT){
    return;
  }

  let INCREASE_EUR = RATE * AMOUNT

  let FINAL_EUR = EUR_AMOUNT + INCREASE_EUR
  let FINAL_TEQ = TEQ_AMOUNT - AMOUNT

  UserAccount.updateOne({userId: USER_ID, [TEQ]: FINAL_TEQ, 'EUR': FINAL_EUR}).then(async doc => {
    let history = new InvestmentHistory({
      userId: USER_ID,
      text: AMOUNT + " " + TEQ+ " sold.",
      date: new Date()
    })

    history.save().then(doc => {

    }).catch(error => {
      console.log(error)
    })
    }).catch(error => {
      console.log(error)
  })
}

// async for each funtion
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

module.exports.findUserFollows = async spec => {
  const data = await UserFollow.find(spec).lean()
  return await Promise.all(data.map(async el => {
    const followingUser = await User.findOne({_id: el.FollowingId})
    const followedUser = await User.findOne({_id: el.FollowedId})
    let payload = {...el}
    if(followingUser) {
      payload = {
        ...payload,
        FollowingName: followingUser.name,
        FollowingSurname: followingUser.surname
      }
    }
    if(followedUser) {
      payload = {
        ...payload,
        FollowedName: followedUser.name,
        FollowedSurname: followedUser.surname,
      }
    }
    return payload}))
}

module.exports.findUserComments = async spec => {
  const data = await Comment.find(spec).lean()
  return await Promise.all(data.map(async el => {
    const user = await User.findOne({_id: el.userId})
    if (user) {
      return {
        ...el,
        username: user.name,
        usersurname: user.surname
      }
    } else {
      return {
        ...el,
        username: '<deleted user>',
        usersurname: ' ',
      }
    }
  }))
}

module.exports.findUserArticle = async spec => {
  const data = await Article.find(spec).lean()
  return await Promise.all(data.map(async el => {
    const user = await User.findOne({_id: el.userId})
    return {
      ...el,
      username: user.name,
      usersurname: user.surname
    }}))
}

resultPredictions = schedule.scheduleJob('2 */2 * * *', async function() {
  // Get currencies
  const currencies = await CurrentTradingEquipment.find()

  var ONE_DAY = 24 * 60 * 60 * 1000;
  const data = await TradingEquipmentPrediction.find()

  for(const element of data){
    if(((new Date) - element.DateWithTime) > ONE_DAY){
      let TradingEq = element.TradingEq;
      // get the current value of the predicted currency
      const currency =  currencies.filter(function(c) {
        return c.from == TradingEq;
      });

      let currentValue = currency[0].rate;
      if(element.Result != "")
        continue;

      // check whether the value at the prediction time is higher or lower than the current value and determine prediction result accordingly
      if(element.CurrentValue > currentValue){
        if(element.Prediction == "down")
          element.Result = "true"
        else
          element.Result = "false"
      } else if(element.CurrentValue < currentValue){
        if(element.Prediction == "down")
          element.Result = "false"
        else
          element.Result = "true"
      } else if(element.CurrentValue == currentValue)
          element.Result = "nochange"

      // now update prediction rate of users
      let UserId = element.UserId;
      let user = await User.findOne({_id: UserId})
      
      if(!user)
        continue;
      
      let predictionRate = user.predictionRate;

      // there is no previous prediction data. Now start with 0/0
      if(predictionRate == null || predictionRate == undefined)
        predictionRate = "0/0"
      
      let temp = predictionRate.split('/')
      let leftSide = parseInt(temp[0]);
      let rightSide = parseInt(temp[1]);

      if(element.Result == "true")
        leftSide+=1;
      
      if(element.Result == "true" || element.Result == "false")
        rightSide+=1

      predictionRate = leftSide+"/"+rightSide;

      // update database with the updated prediction rates
      await User.updateOne({_id:UserId},{ predictionRate: predictionRate }) 
      .then(doc => {

      }).catch(error => {
        
      });

      TradingEquipmentPrediction.deleteOne({ _id: element._id}, (err, results) => {
        if (err) {
          
        }
      });
    }
  }
});

module.exports.filterData = (data, fields, keyword, max_ = 1) => {
  keyword = keyword.toLowerCase()
  
  return data.filter((row) => {
    return fields.filter(field => {
      const words = String(row[field]).toLowerCase().split(' ')
      return words.filter(word => {
        return levenstein(word, keyword) <= max_
      }).length > 0
    }).length > 0
  })
}

/*
  Get method for Coin Trading Equipments.
  Using 3rd party API, it saves coins to database.
*/
getCoinsFromAPI = schedule.scheduleJob('0 23 * * *', function() {
  isOnlyToday = true
  // read coins from file
  fs.readFile('./coins.txt', 'utf8', function(err, contents) {
    let coins = contents.split('\n'); // form an array consist of currencies
    func = "DIGITAL_CURRENCY_DAILY"
    const start = async () => {
      await asyncForEach(coins, async (coin) => {
        await waitFor(13*1000)              // wait 13 second to complete. Because the limit is 5 request per minute
        from_symbol = coin.split(',')[0]    // coin code
        name = coin.split(',')[1]           // coin name
        if(!from_symbol)
         return
  
        // Take the EUR value for every coin
        to_symbol = 'EUR'
  
        // form the request url
        let trading_eq_url = trading_eq_url_base + "function=" + func + "&symbol="+from_symbol+"&market="+to_symbol+"&outputsize=full&apikey="+tradingEquipmentKey;
        
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
            let time_series = obj["Time Series (Digital Currency Daily)"];

            var currentDay = new Date();
            var day_format = currentDay.toISOString().slice(0,10); // yyyy-mm-dd
  
            // save all the days until until_day
            while(time_series && day_format >= until_day){
  
              let temp = time_series[day_format];
  
              // if there is no info for the current day, continue with the previous day
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
                open : temp["1a. open (EUR)"],
                high : temp["2a. high (EUR)"],
                low : temp["3a. low (EUR)"],
                close : temp["4a. close (EUR)"],
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
});

