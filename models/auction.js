const mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  isBided: {
    type: Boolean,
    required: true,
  },
  bidValue: {
    type: Number,
    required: true,
    min: 0,
  },
  characterId: {
    type: mongoose.Types.ObjectId,
    ref: "Character",
  },
});

const Auction = mongoose.model("Auction", auctionSchema);

module.exports.Auction = Auction;
