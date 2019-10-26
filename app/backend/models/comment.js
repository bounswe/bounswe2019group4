const {mongoose} =  require('../db');  // The mongodb connector library

let Comment = mongoose.model('Comment', {

  userId: {
    type: String,
    require: true
  },

  related: {
    type: String,
    require: true
  },

  text: {
    type: String,
    require: true
  },

  date:{
    type: Date,
    require: true
  },

  about:{
    type: String,
    require: true
  }
});

module.exports = {
  Comment: Comment
}