const mongoose = require("mongoose");
const joi = require("joi");

const serverTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const ServerType = mongoose.model("ServerType", serverTypeSchema);

function validateServerType(serverType) {
  const schema = {
    name: joi.string().required(),
  };

  return joi.validate(serverType, schema);
}

exports.ServerType = ServerType;
exports.validate = validateServerType;
