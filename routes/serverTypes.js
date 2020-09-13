const express = require("express");
const router = express.Router();
const { ServerType, validate } = require("../models/serverType");

router.get("/", async (req, res) => {
  const serverTypes = await ServerType.find();

  res.send(serverTypes);
});

module.exports = router;
