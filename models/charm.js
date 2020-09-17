const mongoose = require("mongoose");
const { charms } = require("../helpers/constants");

const charmSchema = new mongoose.Schema({
  charmExpansion: {
    type: Boolean,
    required: true,
    default: false,
  },
  usedPoints: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  unusedPoints: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  available: [String],
});

const Charm = mongoose.model("Charm", charmSchema);

module.exports.Charm = Charm;
module.exports.charmSchema = charmSchema;
