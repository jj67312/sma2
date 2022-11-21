const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Portfolio = require('./PortfolioModel');

// this is basically going to add on to our user schema a username and password
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
  portfolios: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Portfolio',
      unique: false,
    },
  ],

});



// this is basically going to add on to our user schema a username and password
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
