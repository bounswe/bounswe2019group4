const express = require('express')
const router = express.Router()

/* 
 * Retrieves a certain exchange rate. Takes two 
 * currencies as parameters with a dash between them
 */ 
router.get("/:from-:to", (req, res) => {
    let params = req.params
    res.send({status: `Wanted to retrieve the rate ${params['from']}/${params['to']}?`})
})

// Retrieves all exchange rates the API can
router.get("/$", (req, res) => {
    res.send({status: `I suppose you wanted to retrieve all exchange rates.`})
})

module.exports = router