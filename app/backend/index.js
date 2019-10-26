'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session')
const cors = require('cors')
const MongoStore = require('connect-mongo')(session)

const { mongoose } = require('./db')
const { sessionSecret } = require('./secrets')

const { requireJSON } = require('./controllers/middleware')
const { scheduleAPICalls } = require('./utils')

var isOnlyToday = false;


const app = express()   // the express instance that's doing everything

app.use(cors())         // adds support for CORS requests
// cookie session middleware. Saves session ID's in cache, since we didn'te provide a store
app.use(session({
    name: 'arkenstone',
    resave: false,
    saveUninitialized: false,
    secret: sessionSecret,
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,     // one week
    },
}))

app.use(requireJSON)        // responds with an error message when POST requests aren't JSON

app.use(bodyParser.json()); // parses request body and binds to the request argument, request.body

app.use('/auth/', require('./routes/login-signup'))  // includes login/signup endpoints to the main app

app.use('/profile/', require('./routes/profile')) // includes profile page endpoints to the main app

app.use('/events/', require('./routes/events')) // includes events endpoints to the main app

app.use('/trading-equipments/', require('./routes/trading-eq')) // includes trading equipments endpoints to the main app

app.use('/comments/', require('./routes/comments')) // includes comment endpoints to the main app

// catches all GET requests that arrive at this point
app.use(/.*/, (request, response, nextHandler) => {
    response.status(404).send({ whatdidyoumean: `The request isn't supposed to enter that handler.` })
})

scheduleAPICalls(); // schedule API Calls that are implemented in utils.js

const PORT = parseInt(process.argv[2]) || 8080  // optionally runs on the port given to the command 'yarn dev'
console.log(`Listening on port ${PORT}`)
app.listen(PORT)    // the app watches for incoming requests on given port
