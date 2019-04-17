const mongoose =  require('mongoose');

mongoose.connect('mongodb://mongoadmin:secret@18.219.229.31:27017/admin', {useNewUrlParser: true});

var userSchema = mongoose.Schema();

var User = mongoose.model('User', {
  name: {
    type: String,
    required: true,
  },
  
  surname: {
    type: String,
    required: true,
  },

  email: { 
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
  },

  location: {
    type: String,
    required: true,
  },

  isTrader: {
    type: Boolean,
    default: false,
  },

  iban: {
    type: String,
    default: null,
  },

  tckn: {
    type: String,
    default: null,
  },
});

module.exports = {
  User: User,
};