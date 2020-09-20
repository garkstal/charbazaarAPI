const express = require("express");
const router = express.Router();
const { Auction } = require("../models/auction");

router.get("/", async (req, res) => {
  const auctions = await Auction.find();

  res.send(auctions);
});

router.get("/:id", async (req, res) => {
  const auction = await Auction.findById(req.params.id);

  if (auction)
    return res.status(400).send("Auction with this ID does not exists.");

  res.send(auction);
});

router.post("/", async (req, res) => {
  /*const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);*/

  const auction = await Auction.findOne({ id: Number(req.body.id) });
  if (auction)
    return res.status(400).send("Auction with this ID alread exist.");

  const {
    id,
    startDate,
    endDate,
    bidInfo,
    bidValue,
    characterId,
    status,
  } = req.body;
  var _auction = new Auction({
    id: id,
    startDate: startDate,
    endDate: endDate,
    bidInfo: bidInfo,
    bidValue: bidValue,
    characterId: characterId,
    status: status,
  });

  await _auction.save(_auction);
  res.send(_auction);
});

router.put("/:id", async (req, res) => {
  const auction = await Auction.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true }
  );

  if (!auction)
    return res.status(404).send("Auction with given ID does not exist");

  await auction.save(auction);
  res.send(auction);
});

router.delete("/:id", async (req, res) => {
  const auction = await Auction.findByIdAndRemove(req.params.id, {
    useFindAndModify,
  });

  if (!auction)
    return res.status(404).send("Auction with given ID does not exist.");

  res.send(auction);
});

module.exports = router;
