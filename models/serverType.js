const mongoose = require("mongoose");
const Joi = require("joi");

const serverTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const ServerType = mongoose.model("ServerType", serverTypeSchema);

function validateServerType(serverType) {
  const schema = {
    name: Joi.string().required(),
  };

  return Joi.validate(serverType, schema);
}

exports.ServerType = ServerType;
exports.validate = validateServerType;
