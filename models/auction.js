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
  bidInfo: {
    type: String,
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
  status: {
    type: String,
    required: true,
  },
});

const Auction = mongoose.model("Auction", auctionSchema);

module.exports.Auction = Auction;
