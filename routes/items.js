const express = require("express");
const router = express.Router();
const { Item } = require("../models/item");

router.get("/", async (req, res) => {
  const items = await Item.find();

  res.send(items);
});

router.get("/:id", async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (item) return res.status(400).send("Item with this ID does not exists.");

  res.send(item);
});

router.post("/", async (req, res) => {
  const item = await Item.findOne({ name: name });
  if (item) return res.status(400).send("Item with this name already exist.");

  const { ids, name, tibiaGoldPrice, tibiaCoinsPrice } = req.body;
  var _item = new Item({
    ids: ids,
    name: name,
    tibiaCoinsPrice: tibiaCoinsPrice || 0,
    tibiaGoldPrice: tibiaGoldPrice || 0,
  });

  await _item.save(_item);
  res.send(_item);
});

router.put("/:id", async (req, res) => {
  const item = await Item.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
  });

  if (!item) return res.status(404).send("Item with given ID does not exist");

  await item.save(item);
  res.send(item);
});

router.delete("/:id", async (req, res) => {
  const item = await Item.findByIdAndRemove(req.params.id, {
    useFindAndModify,
  });

  if (!item) return res.status(404).send("Item with given ID does not exist.");

  res.send(item);
});

module.exports = router;
