const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  ids: {
    type: [Number],
    required: true,
  },
  tibiaCoinsPrice: {
    type: Number,
  },
  tibiaGoldPrice: {
    type: Number,
  },
  name: {
    type: String,
    required: true,
  },
});

const Item = mongoose.model("Item", itemSchema);

module.exports.Item = Item;
