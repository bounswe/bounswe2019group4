const bcrypt = require('bcryptjs');
let { User } = require('./../models/user.js');  // The connection to the User model in the database

/*
  Get method for profile page.
  Get user id from parameter and responses accordingly.
*/
module.exports.getDetails = async (request, response) => {
  let UserFollow = request.models['UserFollow']
  let UserRequestedFollow = request.models['UserRequestedFollow']
  let User = request.models['User']
  
  const id = request.params['id']
  const currentUser = request.session['user']

  if(currentUser && currentUser._id == id) {  // when the user asks for his own details
    followings = await UserFollow.find({ FollowingId: id })
    followers = await UserFollow.find({ FollowedId: id })
    followRequests = await UserRequestedFollow.find({ FollowedId: id})

    return response.send({
      currentUser,
      followings,
      followers,
      followRequests
    })
  } else {
    user = await User.findOne({ _id : id })
    if(user){ // if such user exists
      if(user.isPublic){ // if user is public return directly
        const { _id, isTrader, isPublic, name, surname, email, location } = user    // Extract certain keys from doc
        followings = await UserFollow.find({ FollowingId: id })
        followers = await UserFollow.find({ FollowedId: id })
        
        return response.send({
          _id, isTrader, isPublic, name, surname, email, location,
          followings,
          followers
        })
      } else { // if user is private check for following condition
        if(currentUser){
          status = await UserFollow.findOne({ FollowingId : currentUser._id, FollowedId : user._id })
          if(status){
            const { _id, isTrader, isPublic, name, surname, email, location } = user    // Extract certain keys from doc
            followings = await UserFollow.find({ FollowingId: id })
            followers = await UserFollow.find({ FollowedId: id })
        
            return response.send({
              _id, isTrader, isPublic, name, surname, email, location,
              followings,
              followers
            })
          } else{
            return response.status(400).send({
              errmsg: "Profile is private."
            })  
          }
        } else {
          return response.status(400).send({
            errmsg: "Profile is private."
          }) 
        }
      }
    } else{
      return response.status(400).send({
        errmsg: "No such user."
      })
    }
  }
}

/*
  Post method for following user.
*/
module.exports.followUser = async (request, response) => {
  const UserFollow = request.models['UserFollow']
  const UserRequestedFollow = request.models['UserRequestedFollow']
  const User = request.models['User']
  
  let followingId = request.session['user']._id
  let followedId = request.params['id']

  follower = await User.findOne({ _id : followedId })

  if(follower){ // If user exists
    status = await UserFollow.findOne({ FollowingId : followingId, FollowedId : followedId })

    if(!status){ // If not following right now
      let follow;
      if(follower.isPublic){ // If user is public
        follow = new UserFollow({
          FollowingId: followingId,
          FollowingName: request.session['user'].name,
          FollowingSurname: request.session['user'].surname,
          FollowedId: followedId,
          FollowedName: follower.name,
          FollowedSurname: follower.surname
        });
      } else {
        follow = new UserRequestedFollow({
          FollowingId: followingId,
          FollowingName: request.session['user'].name,
          FollowingSurname: request.session['user'].surname,
          FollowedId: followedId,
          FollowedName: follower.name,
          FollowedSurname: follower.surname
        });
      }

    follow.save()
      .then(doc => {
        return response.status(204).send();
      }).catch(error => {
        return response.status(400).send(error);
      });
    } else {
        return response.status(400).send({
          errmsg: "Already following that user."
        })
    }
  } else {
      return response.status(400).send({
      errmsg: "No such user."
    })
  }
}

/*
  Post method for unfollowing user.
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

    return response.send(204);
  });
}

/*
  Post method for accepting user follow request.
*/
module.exports.acceptRequest = async (request, response) => {
  let UserFollow = request.models['UserFollow']
  const UserRequestedFollow = request.models['UserRequestedFollow']

  const followingId = request.session['user']._id
  const requestId = request.params['id']

  req = await UserRequestedFollow.findOne({ _id : requestId})

  // If there exists such request
  if(req){ 
    let follow = new UserFollow({
          FollowingId: req.FollowingId,
          FollowingName: req.FollowingName,
          FollowingSurname: req.FollowingSurname,
          FollowedId: req.FollowedId,
          FollowedName: req.FollowedName,
          FollowedSurname: req.FollowedSurname
        });

    // Save it into user-follow table
    follow.save() 
      .then(doc => {
        return response.status(204).send();
      }).catch(error => {
        return response.status(400).send(error);
      });    

    //delete it from requests
    await UserRequestedFollow.deleteOne({ _id : requestId }, (err, results) => { 
      if(err){
        return response.status(404).send({
          errmsg: "Failed."
        })
      }
      return response.send(204);
    })
  } else {
    response.status(400).send({
      errmsg: "No such request."
    })
  }
  
}

/*
  Post method for rejecting user follow request.
*/
module.exports.rejectRequest = async (request, response) => {
  const UserRequestedFollow = request.models['UserRequestedFollow']
  
  const requestId = request.params['id']

  await UserRequestedFollow.deleteOne({ _id : requestId }, (err, results) => {
    if(err){
      return response.status(404).send({
        errmsg: "Failed."
      })
    }
    
    return response.send(204);
  })
}

