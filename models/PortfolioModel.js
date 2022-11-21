const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./UserModel.js');

const PortfolioSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  stocks: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Stock',
    },
  ],
});


module.exports = mongoose.model('Portfolio', PortfolioSchema);
