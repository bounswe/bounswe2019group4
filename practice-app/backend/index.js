'use strict'

const express = require('express')

const app = express()   // the express instance that's doing everything

// a dummy endpoint that responds everything with a static JSON
app.use('/', (request, response, nextHandler) => {
    console.log(`Received a request at ${request.url}`)
    nextHandler()
})

app.use(require('./routes/login-signup'))

app.get('/', (request, response, nextHandler) => {
    response.send({ whatdidyoumean: `Why would you send a GET request to '${request.url}' ?`})
})

app.post('/', (request, response, nextHandler) => {
    console.log('received a POST')
    response.send({status: `Seems ok to me`})
})

const PORT = 8080   // TODO make it possible to accept the port to run on as argument
console.log(`Listening on port ${PORT}`)
app.listen(PORT)    // the app watches for incoming requests on given port
