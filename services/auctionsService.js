const config = require("config");
const port = config.get("port");
const endpoint = "http://localhost:" + port + "/api/auctions";
const axios = require("axios");

async function getAuctions() {
  try {
    const { data } = await axios.get(endpoint);
    return data;
  } catch (error) {
    console.log(error.response.data);
  }
}

async function createAuction(auction) {
  try {
    const { data } = await axios.post(endpoint, {
      id: auction.id,
      startDate: auction.startDate,
      endDate: auction.endDate,
      bidInfo: auction.bidInfo,
      bidValue: auction.bidValue,
      characterId: auction.characterId,
      status: auction.status,
    });
    console.log(`Created auction: ${data.id}`);
    return data;
  } catch (error) {
    console.log(error.response.data);
  }
}

async function updateAuction(auction) {
  try {
    const { data } = await axios.put(endpoint + "/" + auction._id, {
      id: auction.id,
      startDate: auction.startDate,
      endDate: auction.endDate,
      bidInfo: auction.bidInfo,
      bidValue: auction.bidValue,
      characterId: auction.characterId,
      status: auction.status,
    });
    console.log(`Auction updated, ID: ${auction.id}`);
    return data;
  } catch (error) {
    console.log(error.response.data);
  }
}

module.exports.createAuction = createAuction;
module.exports.updateAuction = updateAuction;
module.exports.getAuctions = getAuctions;
