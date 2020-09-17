const express = require("express");
const router = express.Router();
const { ServerType, validate } = require("../models/serverType");

router.get("/", async (req, res) => {
  const serverTypes = await ServerType.find();

  res.send(serverTypes);
});

router.get("/:id", async (req, res) => {
  const serverType = await ServerType.findById(req.params.id);

  if (!serverType)
    return res.status(404).send("Server Type with this ID does not exists.");

  res.send(serverType);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const serverTypes = await ServerType.find();
  const name = serverTypes.find(
    (n) => n.name.toLowerCase() === req.body.name.toLowerCase()
  );

  if (name)
    return res.status(400).send("Server Type with this name already exists.");

  var type = new ServerType({
    name: req.body.name,
  });

  await type.save(type);
  res.send(type);
});

router.delete("/:id", async (req, res) => {
  const serverType = await ServerType.findByIdAndRemove(req.params.id, {
    useFindAndModify,
  });

  if (!serverType)
    return res.status(404).send("Server Type with given ID does not exist.");

  res.send(serverType);
});

module.exports = router;
