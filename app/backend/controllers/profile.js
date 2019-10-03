const bcrypt = require('bcryptjs');
let { User } = require('./../models/user.js');  // The connection to the User model in the database

/*
  Get method for profile page.
  Get user id from parameter and respondes accordingly.
*/
module.exports.getDetails = async (request, response) => {
  const id = request.params['id']
  const currentUser = request.session['user']

  let user = await User.findOne({ _id : id })  // Retrieve the user instance from database

  if(user == null){
    response.status(404).send({
      errmsg: "No such user."
    })
    return
  }
    
  if( currentUser == null ){
    if( user.isPublic ){
      const { _id, isTrader, isPublic, name, surname, email, location } = user  // Extract certain keys from doc
      response.send({ _id, isTrader, isPublic, name, surname, email, location });  // Send only the extracted keys    
    }  else{
      // WILL BE EDITED AFTER FOLLOW SYSTEM
        response.status(400).send({
        errmsg: "User has private profile."
      })
    }
  }
  else{
    if( id == currentUser._id ){
      const { _id, isTrader, isPublic, name, surname, email, location } = user  // Extract certain keys from doc
      response.send({ _id, isTrader, isPublic, name, surname, email, location });  // Send only the extracted keys 
    }
    else{
      if( user.isPublic ){
        const { _id, isTrader, isPublic, name, surname, email, location } = user  // Extract certain keys from doc
        response.send({ _id, isTrader, isPublic, name, surname, email, location });  // Send only the extracted keys    
      }  else{
          // WILL BE EDITED AFTER FOLLOW SYSTEM
          response.status(400).send({
          errmsg: "User has private profile."
        })
      }
    }
  }
}

