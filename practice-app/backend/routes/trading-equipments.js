const express = require('express')
const router = express.Router()

// first argument below is a regular expression and captures any string 
router.get(/.*/, (req, res) => {
    res.send({status: `Received request to ${req.originalUrl}`})
})

module.exports = router