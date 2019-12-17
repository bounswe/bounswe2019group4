const mongoose = require("mongoose"); // The mongodb connector library

// Database credentials, contact to the team for the actual file
const { dbCredentials } = require("../secrets.js");

// it says ensureIndex is deprecated and createIndexes should be used instead
mongoose.set("useCreateIndex", true);
mongoose.connect(
  `mongodb://${dbCredentials["ip"]}/admin`,
  {
    useNewUrlParser: true,
    user: dbCredentials["username"],
    pass: dbCredentials["password"],
    useUnifiedTopology: true
  },
  err => {
    if (err) {
      console.log(err);
    }
  }
);

module.exports = {
  mongoose
};
