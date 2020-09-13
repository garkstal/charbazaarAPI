const express = require("express");
const serverTypes = require("../routes/serverTypes");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/serverTypes", serverTypes);
};
