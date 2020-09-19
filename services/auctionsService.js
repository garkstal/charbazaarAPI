const config = require("config");
const port = config.get("port");
const endpoint = "http://localhost:" + port + "/api/auctions";
const axios = require("axios");

async function createAuction(auction) {
  try {
    console.log(auction);
    const { data } = await axios.post(endpoint, {
      id: auction.id,
      startDate: auction.startDate,
      endDate: auction.endDate,
      isBided: auction.isBided,
      bidValue: auction.bidValue,
      characterId: auction.characterId,
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
      id: id,
      startDate: startDate,
      endDate: endDate,
      isBided: isBided,
      bidValue: bidValue,
      characterId: characterId,
    });
    console.log(`Auction updated, ID: ${auction.id}`);
    return data;
  } catch (error) {
    console.log(error.response.data);
  }
}

module.exports.createAuction = createAuction;
module.exports.updateAuction = updateAuction;
