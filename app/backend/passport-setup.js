const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const secret = require('./secrets');
let mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
let { User } = require('./models/user');  // The connection to the User model in the database

passport.use(
    new GoogleStrategy({
        // options for strategy
        callbackURL: '/auth-success',
        clientID: secret.googleCredentials.clientId,
        clientSecret: secret.googleCredentials.clientSecret
    }, async (accessToken, refreshToken, profile, done) => {
        
        console.log(accessToken);
        const email = profile.emails[0].value;

        // User instance to add to the database
        
        let userRegistered = await User.findOne({ email })  // Retrieve the user instance from database
        if (userRegistered) {  // If no instance is returned, credentials are invalid
            return done(null, userRegistered);
        }
        else{
            let user = new User({
                name: profile.name.givenName,
                surname: profile.name.familyName,
                email: email,
                // Hashes the password
                password: bcrypt.hashSync(profile.id, 10),
                location: profile._json.locale,
            });

            // Saves the instance into the database, returns any error occured
            return done(null, user);
        }
    }
));