const {mongoose} =  require('../db');  // The mongodb connector library

let UserFollow = mongoose.model('UserFollow', {
  FollowingId: {
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
  UserFollow: UserFollow
}