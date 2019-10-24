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

  status: {
    type: Boolean,
    require: true,
    default: false,
  }
});

module.exports = {
  UserFollow: UserFollow
}