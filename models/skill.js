const mongoose = require("mongoose");
const Joi = require("joi");
const { skills } = require("../helpers/constants");

const skillSchema = new mongoose.SchemaType({
  type: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    required: true,
    min: 10,
    max: 255,
  },
  percent: {
    type: String,
    required: true,
  },
});

const Skill = mongoose.model("Skill", skillSchema);

function validateSkill(data) {
  const schema = {
    type: Joi.string()
      .valid(...skills)
      .required(),
    level: Joi.number().min(10).max(255).required(),
    percent: Joi.string().required(),
  };

  return Joi.validate(data, schema);
}

module.exports.Skill = Skill;
module.exports.validate = validateSkill;
