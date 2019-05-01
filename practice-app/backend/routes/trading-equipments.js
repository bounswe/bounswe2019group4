const express = require('express')
const secret = require('../secrets')
const request= require('request');
const alpha = require('alphavantage')({key:secret.alphaKey.key})
const router = express.Router()

/* 
 * Retrieves a certain exchange rate. Takes two 
 * currencies as parameters with a dash between them
 * uses alphavantage api
 * currency parameters should be entered by their fx codes
 */ 
router.get("/:from-:to", (req, res) => {
    let params = req.params
  
    alpha.forex.rate(req.params.from, req.params.to).then(data => {
        res.send({
            rate: `${params['from']}/${params['to']}`,
            value: data['Realtime Currency Exchange Rate']['5. Exchange Rate']});
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