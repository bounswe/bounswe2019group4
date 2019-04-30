const express = require('express')
const secret = require('../secrets')

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
        
        res.send(data['Realtime Currency Exchange Rate']['5. Exchange Rate']);
      });
})

// Retrieves all exchange rates the API can
router.get("/$", (req, res) => {
    res.send({status: `I suppose you wanted to retrieve all exchange rates.`})
})

module.exports = router