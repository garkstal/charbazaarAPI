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
    const { data } = await axios.get(url, options);
    return data;
  } catch (error) {
    console.log(error);
  }
}

module.exports.getRequest = getRequest;
