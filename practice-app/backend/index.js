'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const app = express()   // the express instance that's doing everything

app.use(bodyParser.json()); // parses request body and binds to the request argument, request.body

// a dummy endpoint that responds everything with a static JSON
app.use('/', (request, response, nextHandler) => {
    console.log(`Received a request at ${request.url}`)
    nextHandler()   // passes the execution to the next request handler function, which comes right after that one
})

app.use(require('./routes/login-signup'))   // includes login/signup endpoints to the main app

// catches all GET requests that arrive at this point
app.get('/*', (request, response, nextHandler) => {
    response.send({ whatdidyoumean: `Why would you send a GET request to '${request.url}' ?`})
})

// catches all POST requests that arrive at this point
app.post('/*', (request, response, nextHandler) => {
    console.log('received a POST')
    response.send({status: `Seems ok to me`})
})

const PORT = parseInt(process.argv[2]) || 8080  // optionally runs on the port given to the command 'yarn dev'
console.log(`Listening on port ${PORT}`)
app.listen(PORT)    // the app watches for incoming requests on given port
