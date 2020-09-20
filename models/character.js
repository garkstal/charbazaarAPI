const mongoose = require("mongoose");
const { Skill, skillSchema } = require("./skill");
const { Charm, charmSchema } = require("./charm");

const characterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 3,
    max: 30,
  },
  vocation: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 3000,
  },
  world: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  skills: {
    //type: [skillSchema],
    type: [String],
  },
  imbuements: {
    type: [String],
  },
  charms: {
    type: [charmSchema],
  },
  lastUpdate: {
    type: String,
    required: true,
  },
});

const Character = mongoose.model("Character", characterSchema);

module.exports.Character = Character;
