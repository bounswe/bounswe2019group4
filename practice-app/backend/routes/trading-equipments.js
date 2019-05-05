const express = require('express')
const router = express.Router()
const teControllers = require('../controllers/trading-equipments')

/* 
 * Retrieves a certain exchange rate. Takes two 
 * currencies as parameters with a dash between them
 * uses alphavantage api
 * currency parameters should be entered by their fx codes
 */ 
router.get("/:from-:to", teControllers.exactRate)

// Retrieves all exchange rates the API can
// uses currencylayer api
// base currency is USD
router.get("/$", teControllers.dollarRates)

 
module.exports = router