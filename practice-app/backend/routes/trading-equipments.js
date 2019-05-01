const express = require('express')
const secret = require('../secrets')
const request= require('request');
const router = express.Router()

/* 
 * Retrieves a certain exchange rate. Takes two 
 * currencies as parameters with a dash between them
 * uses alphavantage api
 * currency parameters should be entered by their fx codes
 */ 
router.get("/:from-:to", (req, res) => {
    let params = req.params
    request(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${params.from}&to_currency=${params.to}&apikey=${secret.alphaKey.key}`, 
    { json: true }, (err, resp, body) => {
  
        if (err) { // if external api returns error
            res.send({
                Error: "System is under maintanence."
            });
        }
        else if (body.hasOwnProperty('Realtime Currency Exchange Rate')){//when everything is normal sends rate and its value as JSON
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
})

const getCurrencyLayerApiResponse  = (callback) => {
    _url_to_get_list_of_fx_data= `http://apilayer.net/api/live?access_key=${secret.currencyLayerKey.key}`;
    request(_url_to_get_list_of_fx_data, { json: true }, (err, res, body) => {
    if (err) { 
        return callback(err);
     }
    return callback(body);
    });
}
// Retrieves all exchange rates the API can
router.get("/$", (req, res) => {
   getCurrencyLayerApiResponse(function(response){
        if(response["success"]){
            res.send(response["quotes"]);
        }else{
            res.send(response["error"]);
        }
   });
    
})


 
module.exports = router