const {mongoose} =  require('../db');  // The mongodb connector library

let UserRequestedFollow = mongoose.model('UserRequestedFollow', {
  FollowingId: {
    type: String,
    require: true
  },
  
  FollowingName: {
    type: String,
    require: true    
  },

  FollowingSurname: {
    type: String,
    require: true    
  },

  FollowedId: {
    type: String,
    require: true
  },

  FollowedName: {
    type: String,
    require: true    
  },

  FollowedSurname: {
    type: String,
    require: true    
  }
});

module.exports = {
  UserRequestedFollow: UserRequestedFollow
}