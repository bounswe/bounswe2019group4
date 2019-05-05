const request = require('request')
const secret = require('../secrets')

/* 
 * Retrieves a certain exchange rate. Takes two 
 * currencies as parameters with a dash between them
 * uses alphavantage api
 * currency parameters should be entered by their fx codes
 */
module.exports.exactRate = (req, res) => {
    let params = req.params
    request(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${params.from}&to_currency=${params.to}&apikey=${secret.alphaKey.key}`, 
    { json: true }, (err, resp, body) => {
  
        if (err) { // if external api returns error
            res.send({
                Error: "System is under maintanence."
            });
        }
        else if (body.hasOwnProperty('Realtime Currency Exchange Rate')){//when everything is normal sends a rate and its value as JSON
            res.send({
                rate: `${params['from']}/${params['to']}`,
                value: body['Realtime Currency Exchange Rate']['5. Exchange Rate']
            });
        }
        else if (body.hasOwnProperty('Error Message')){//when user gives wrong parameters
            res.status(400).send({
                Error: "Invalid API call."
            })
        }else{//when user makes excessive requests
            res.status(400).send({
                Error: "More than 5 trials are not supported in one minute!"
            })
        }
    });
}

// Retrieves all exchange rates the API can
// uses currencylayer api
// base currency is USD
module.exports.dollarRates = (req, res) => {
    request(`http://apilayer.net/api/live?access_key=${secret.currencyLayerKey.key}`, { json: true }, (err, resp, body) => {
        if(err){
            res.send({// if external api returns error
                Error: "System is under maintanence."
            });
        }
        else if(body["success"]){//when everything is normal sends the list of rates with their values as JSON (base currency is USD)
            res.send(body["quotes"]);
        }
        else{//when user makes excessive requests
            res.status(400).send({
                Error: "The monthly api request limit has been reached!"
            })
        }
    });
}