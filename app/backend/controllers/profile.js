const bcrypt = require('bcryptjs');
let { User } = require('./../models/user.js');  // The connection to the User model in the database

const {findUserFollows, checkPassword, checkIBAN, checkTCKN} = require('../utils')
/*
  Get method for profile page.
  Get user id from parameter and responses accordingly.
*/

async function profileResponse(user, me, followStatus, TradingEqFollow, Article) {
  let followings = await findUserFollows({ FollowingId: user._id, status: true })
  let followers = await findUserFollows({ FollowedId: user._id, status: true })
  let followRequests = await findUserFollows({ FollowedId: user._id, status: false})
  let followingTradings = await TradingEqFollow.find({ UserId : user._id })
  let articles = await Article.find().where('userId').equals(user._id)
  if(me){ // if profile is mine
    obj = {
      user,
      following: followings.length,
      followings,
      follower: followers.length,
      followers,
      followRequest: followRequests.length,
      followRequests,
      followingTradings,
      articles
    }
    return obj;
  } else { // if profile is others
      if (user.isPublic || followStatus == 'TRUE') { // if profile is public or i am following
        tempUser = { _id : user._id, 
          isTrader : user.isTrader, 
          isPublic : user.isPublic, 
          name : user.name, 
          surname : user.surname, 
          email : user.email, 
          location: user.location
        }

        obj = {
          user : tempUser,
          following: followings.length,
          followings,
          follower: followers.length,
          followers,
          followStatus,
          followingTradings,
          articles
      }
      return obj;
      } else { // if profile is private and i am not following right now.
        tempUser = { _id : user._id, 
          isPublic : user.isPublic, 
          name : user.name, 
          surname : user.surname
        }

        obj = {
          user: tempUser,
          following: followings.length,
          follower: followers.length,
          followStatus
        }
        return obj
    }
  }
}

module.exports.getDetails = async (request, response) => {
  let UserFollow = request.models['UserFollow']
  let User = request.models['User']
  let TradingEqFollow = request.models['TradingEquipmentFollow']
  let Article = request.models['Article']

  const requestedUserId = request.params['id']
  const currentUser = request.session['user']

  try {
    if(currentUser && currentUser._id == requestedUserId) {  // when the user asks for his own details
      res = await profileResponse(currentUser, true, null, TradingEqFollow, Article)
      return response.send(res);
    } else {  // when the user requested isn't the user logged in himself
      const requestedUser = await User.findOne({ _id : requestedUserId })   // finds the user instance requested if it exists
      if(requestedUser){ // if it exists
        followStatus = 'FALSE'
        if(currentUser){ // if user logged in
          entry = await UserFollow.findOne({ FollowingId : currentUser._id, FollowedId : requestedUser._id }) // check whether they follow each other
          if(entry){ // if following or request sent
            followStatus = entry.status ? 'TRUE' : 'PENDING' 
          }
        }
        res = await profileResponse(requestedUser, false, followStatus, TradingEqFollow, Article)
        return response.send(res);        
      } else {  // when there's no user with given ID
        return response.status(400).send({
          errmsg: "No such user."
        })
      }
    }
  } catch (error) {
    return response.status(400).send({errmsg: 'Unexpected error occured. Please check the request context and try again.'})
  }
}

/*
  Get method for following user.
*/
module.exports.followUser = async (request, response) => {
  const UserFollow = request.models['UserFollow']
  const User = request.models['User']
  
  let followingId = request.session['user']._id
  let followedId = request.params['id']

  follower = await User.findOne({ _id : followedId })

  if(follower){ // If user exists
    status = await UserFollow.findOne({ FollowingId : followingId, FollowedId : followedId })

    if(!status){ // If not following right now
      let follow = new UserFollow({
        FollowingId: followingId,
        FollowedId: followedId,
      });

      if(follower.isPublic){ // If user is public
        follow.status = true
      } else {
        follow.status = false
      }

    follow.save()
      .then(doc => {
        return response.status(204).send();
      }).catch(error => {
        return response.status(400).send(error);
      });
    } else {
        return response.status(400).send({
          errmsg: "Already following or requested to follow that user."
        })
    }
  } else {
      return response.status(400).send({
      errmsg: "No such user."
    })
  }
}

/*
  Get method for unfollowing user.
*/
module.exports.unfollowUser = async (request, response) => {
  let UserFollow = request.models['UserFollow']

  const followingId = request.session['user']._id
  const followedId = request.params['id']
  
  UserFollow.deleteOne({ FollowingId : followingId, FollowedId : followedId }, (err, results) => {
    if(err){
      return response.status(404).send({
        errmsg: "Failed."
      })
    }

    return response.sendStatus(204);
  });
}

/*
  Get method for accepting user follow request.
*/
module.exports.acceptRequest = async (request, response) => {
  let UserFollow = request.models['UserFollow']

  const followingId = request.session['user']._id
  const requestId = request.params['id']

  req = await UserFollow.findOne({ _id : requestId, FollowedId: request.session['user']._id, status: false})

  // If there exists such request
  if(req){ 
    req.status = true;

    // Save it into user-follow table
    req.save() 
      .then(doc => {
        return response.status(204).send();
      }).catch(error => {
        return response.status(400).send(error);
      });    
  } else {
    response.status(400).send({
      errmsg: "No such request."
    })
  }
  
}

/*
  Get method for rejecting user follow request.
*/
module.exports.rejectRequest = async (request, response) => {
  const UserFollow = request.models['UserFollow']
  
  const requestId = request.params['id']

  await UserFollow.deleteOne({ _id : requestId, FollowedId: request.session['user']._id, status: false }, (err, results) => {
    if(err){
      return response.status(404).send({
        errmsg: "Failed."
      })
    }
    
    return response.sendStatus(204);
  })
}

/*
  Patch method for editing profile details.
  It saves profile to database.
*/
module.exports.editProfile = async (request, response) => {
  const userId = request.session['user']._id

  const { name, surname, email, location, isTrader, isPublic, iban, tckn } = request.body  // Extract fields

  // check valid iban
  if(iban && !checkIBAN(iban)) {
    return response.status(400).send({
      errmsg: "Enter valid iban."
    })
  }
  // check valid tckn
  if(tckn && !checkTCKN(tckn)) {
    return response.status(400).send({
      errmsg: "Enter valid TCKN"
    })
  }

  row = await User.findOne({ _id : userId});

  if(row){
    // Check email is changed
    if(email && email != row.email){
      return response.status(400).send({
        errmsg: "Users cannot change their email."
      })
    }
    try{
        await User.updateOne({_id:userId},{ name: name, surname: surname, location: location, 
                                            iban: iban, tckn: tckn, isPublic: isPublic, isTrader: isTrader}) 
        .then( doc => {
          return response.status(204).send();
        }).catch(error => {
          return response.status(400).send(error);
        });
    } catch(error){
      return response.status(404).send({
        errmsg: error.message
      })
    }
  } else {
    return response.status(400).send({
      errmsg: "No such user."
       })
  }
}

/*
  Patch method for change password.
*/
module.exports.changePassword = async (request, response) => {
  const userId = request.session['user']._id

  const { oldPassword, password } = request.body  // Extract fields

  row = await User.findOne({ _id : userId});

  if(row){
    // check whether user is authenticated via Google. If so, return error
    if(row.googleId){
      return response.status(400).send({
        errmsg: "Users authenticated via Google cannot change their password"
      })
    }

    // If password hashed in the user instance doesn't match with the old password in the request, credentials are invalid
    if (bcrypt.compareSync(oldPassword, row['password'])) {
       // The user credentials are correct
       // check valid password
      if(password && !checkPassword(password)) {
        return response.status(400).send({
          errmsg: "Enter valid password. Your password either is less than 6 characters or is easy to guess."
        })
      }
      
      // Hashes the password
      hashedPassword = bcrypt.hashSync(password, 10)

      try{
          await User.updateOne({_id:userId},{password: hashedPassword}) 
          .then( doc => {
            return response.status(204).send();
          }).catch(error => {
            return response.status(400).send(error);
          });
      } catch(error){
        return response.status(404).send({
          errmsg: error.message
        })
      }
    } else {
      return response.status(400).send({
        errmsg: "Old password is not correct"
      })
    }
    
  } else {
    return response.status(400).send({
      errmsg: "No such user."
    })
  }
}