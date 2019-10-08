'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session')
const cors = require('cors')

const { sessionSecret } = require('./secrets')
const passport = require('passport');
const passportSetup = require('./passport-setup');
let { User } = require('./models/user');  // The connection to the User model in the database


const app = express()   // the express instance that's doing everything

app.use(cors())         // adds support for CORS requests
// cookie session middleware. Saves session ID's in cache, since we didn'te provide a store
app.use(session({
    name: 'arkenstone',
    resave: false,
    saveUninitialized: false,
    secret: sessionSecret,
}))
app.use(bodyParser.json()); // parses request body and binds to the request argument, request.body

app.use('/auth/', require('./routes/login-signup'))  // includes login/signup endpoints to the main app

// callback url upon successful google authentication
app.get('/auth-success', passport.authenticate('google', {session: false}), (req, res) => {
    //authService.signToken(req, res);
    console.log(res.req.user)
    let email = res.req.user.email
    let userRegistered = User.findOne({ email })  // Retrieve the user instance from database
    
    if (userRegistered) {  // If no instance is returned, credentials are invalid
        // The user credentials are correct, its instance is userRegistered and added to the cookie

        req.session['user'] = userRegistered
        const { _id, isTrader, isPublic, name, surname, email, location } = userRegistered  // Extract certain keys from user
        res.send({
        msg: 'Successfully logged in.',
        _id, isTrader, isPublic, name, surname, email, location  // Send only the extracted keys
        })
    }
    else{
        let user = new User({
            ...res.req.user,
            name: res.req.user.name,
            surname: res.req.user.surname,
            email: res.req.user.email,
            location: res.req.user.location,
            password: res.req.user.password
        });
        console.log(user)
        // Saves the instance into the database, returns any error occured
        user.save().then((doc) => {
        // Omit sensitive data
        const { _id, isTrader, isPublic, name, surname, email, location } = doc  // Extract certain keys from doc
        res.send({ _id, isTrader, isPublic, name, surname, email, location });  // Send only the extracted keys 
        }, (error) => {
        res.status(400).send(error);
        });
    }
    
});0

app.use('/profile/', require('./routes/profile')) // includes profile page endpoints to the main app


// catches all GET requests that arrive at this point
app.use(/.*/, (request, response, nextHandler) => {
    response.status(404).send({ whatdidyoumean: `The request isn't supposed to enter that handler.` })
})

const PORT = parseInt(process.argv[2]) || 8080  // optionally runs on the port given to the command 'yarn dev'
console.log(`Listening on port ${PORT}`)
app.listen(PORT)    // the app watches for incoming requests on given port
