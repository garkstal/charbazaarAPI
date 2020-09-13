const mongoose = require("mongoose");
const config = require("config");

module.exports = function () {
  const db = config.get("db");

  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected with database.");
    })
    .catch((err) => {
      console.log("Error occured while connecting to DB", err);
    });
};
