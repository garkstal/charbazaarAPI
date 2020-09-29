const express = require("express");
const serverTypes = require("../routes/serverTypes");
const auctions = require("../routes/auctions");
const characters = require("../routes/characters");
const items = require("../routes/items");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/serverTypes", serverTypes);
  app.use("/api/auctions", auctions);
  app.use("/api/characters", characters);
  app.use("/api/items", items);
};
