const express = require("express");
const app = express();
const config = require("config");
const { main } = require("./startup/webScrapper");

require("./startup/db")();
require("./startup/cors")(app);
require("./startup/routes")(app);
require("./startup/validation")();

const port = process.env.PORT || config.get("port");
app.listen(port, () => {
  console.log(`Server runnig at port ${port}/`);
});

main();
