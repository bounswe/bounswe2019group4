const express = require('express')

const router = express.Router()

router.post('/signup', (request, response, nextHandler) => {
    response.send({status: `You've sent a POST request to ${request.url}. Congrats!`})
})

router.post('/login', (request, response, nextHandler) => {
    response.send({status: `You cannot login yet, since we haven't implemented that functionality.`})
})

module.exports = router