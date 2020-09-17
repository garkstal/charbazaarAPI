const mongoose = require("mongoose");

const imbuementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const Imbuement = mongoose.model("Imbuement", imbuementSchema);

module.exports.Imbuement = Imbuement;
module.exports.imbuementSchema = imbuementSchema;
