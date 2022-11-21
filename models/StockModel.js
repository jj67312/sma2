const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StockSchema = new Schema({
  name: {
    type: String,
    unique: false,
  },
  data: [
    {
      x: { type: Date },
      open: { type: Number },
      high: { type: Number },
      low: { type: Number },
      close: { type: Number },
      volume: { type: Number },
    },
  ],
});

module.exports = mongoose.model('Stock', StockSchema);
