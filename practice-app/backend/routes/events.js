const express = require('express')
const router = express.Router()

// Retrieves some important events that happened recently
router.get('/list', (req, res) => {
    res.send({events: ['nothing special']})
})

module.exports = router