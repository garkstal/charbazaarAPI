const axios = require("axios");
const pLimit = require("p-limit");
const config = require("config");

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
    console.log("Response recived from: ", url, typeof data);
    return data;
  } catch (error) {
    if (error.response) {
      console.log("Couldn't recive RESPONSE from: ", url);
    } else if (error.request) {
      console.log("Couldn't send request to: ", url);
    } else {
      console.log(error);
    }
    console.log("RENEWING REQUEST: ", url);
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

async function parallelGetRequest(urls, _limit) {
  const __limit = _limit || config.get("requestsLimit");
  const limit = pLimit(__limit);
  const requests = urls.map((url) => {
    return limit(() => getRequest(url));
  });

  const data = [];
  await (async () => {
    const results = await Promise.all(requests);
    results.forEach((r) => data.push(r));
    console.log(`Finalized: ${results.length} requests`);
  })();

  return data;
}

module.exports.getRequest = getRequest;
module.exports.dbGetRequest = dbGetRequest;
module.exports.parallelGetRequest = parallelGetRequest;
