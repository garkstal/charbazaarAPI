const axios = require("axios");

async function getRequest(url) {
  var options = {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:79.0) Gecko/20100101 Firefox/79.0",
      "Content-Type": "text/html; charset=ISO-8859-1",
      "Accept-Encoding": "gzip",
    },
  };

  try {
    console.log("Starting request for: ", url);
    const { data } = await axios.get(url, options);
    console.log("Response recived from: ", url);
    return data;
  } catch (error) {
    if (error.response) {
      console.log("Couldn't recive RESPONSE from: ", url, error);
    } else if (error.request) {
      console.log("Couldn't send request to: ", url, error);
    } else {
      console.log(error);
    }
    await getRequest(url);
  }
}

async function dbGetRequest(uri) {
  try {
    const { data } = await axios.get(uri);
    return data;
  } catch (error) {
    console.log(error);
  }
}

module.exports.getRequest = getRequest;
module.exports.dbGetRequest = dbGetRequest;
