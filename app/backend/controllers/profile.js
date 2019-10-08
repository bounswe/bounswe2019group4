const bcrypt = require('bcryptjs');
let { User } = require('./../models/user.js');  // The connection to the User model in the database

/*
  Get method for profile page.
  Get user id from parameter and responses accordingly.
*/
module.exports.getDetails = async (request, response) => {
  // TODO: followers should be able to see the details of the user they follow
  const id = request.params['id']
  const currentUser = request.session['user']

  if(currentUser && currentUser._id == id) {  // when the user asks for his own details
    response.send(currentUser)
  } else {
    User.findOne({ _id : id})     // Retrieve the user instance from database
      .then(user => {             // when the user with given ID exists
        if(user.isPublic) {       // when the user's data is public 
          const { _id, isTrader, isPublic, name, surname, email, location } = user    // Extract certain keys from doc
          response.send({ _id, isTrader, isPublic, name, surname, email, location })  // Send only the extracted keys
        } else {    // when user's data is private
          response.status(400).send({
            errmsg: "User has private profile."
          })
        }
      })
      .catch(error => {   // when it's the case an error occurs accessing the database
        response.status(404).send({
          errmsg: "No such user."
        })
      })
  }
}

