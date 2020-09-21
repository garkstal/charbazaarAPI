const config = require("config");
const { getRequest, dbGetRequest } = require("../services/httpService");
const {
  createCharacter,
  getCharacterByName,
  getCharacters,
} = require("../services/characterService");
const { createAuction, updateAuction } = require("../services/auctionsService");
const {
  offertsPageCountScrapper,
  getAuctionsFromPage,
  getCharacterDetails,
} = require("../services/scrappingService");
const { default: Axios } = require("axios");
const pLimit = require("p-limit");
const limi = pLimit(5);

async function main() {
  const port = config.get("port");

  const auctionsInDb = await dbGetRequest(
    "http://localhost:" + port + "/api/auctions"
  );
  /*
  const offertsPageCount = await getOffersPageCount();
  const currentOfferts = await getCurrentOfferts(3);
  const auctionsToUpdate = getAuctionsToUpdate(currentOfferts, auctionsInDb);
  await updateDbAuction(auctionsToUpdate);

  console.log("Scrapping website finished.");*/

  const pageData = {
    url: "https://www.tibia.com/charactertrade/?subtopic=pastcharactertrades",
    query:
      "https://www.tibia.com/charactertrade/?subtopic=pastcharactertrades&currentpage=",
    type: "past",
  };

  const pagesCount = await getOffertsPageCount(pageData.url, pageData.type);
  const offerts = await getOfferts(5, pageData.query);
  /* const auctionsToUpdate = getAuctionsToUpdate(offerts, auctionsInDb);
  await updateDbAuction(auctionsToUpdate, pageData.type);
  console.log("FInished");*/
}

async function getOffertsPageCount(url, type) {
  var pageData = await getRequest(url);

  return offertsPageCountScrapper(pageData, type);
}

async function getOfferts(offertsPageCount, query, type) {
  const limit = pLimit(15);
  const urls = [];
  for (let index = 1; index <= offertsPageCount; index++) {
    urls.push(query + index);
  }

  const requests = urls.map((url) => {
    return limit(() => getRequest(url));
  });

  const sites = [];
  await (async () => {
    const result = await Promise.all(requests);
    sites.push(result);
  })();

  const offerts = [];
  sites.forEach((site) => {
    // console.log(w);
    const offertsFromIndexPage = getAuctionsFromPage(site, type);
    offerts.push(...offertsFromIndexPage);
  });

  console.log(offerts);
  return offerts;
}

function getAuctionsToUpdate(currentOfferts, auctionsInDb) {
  console.log("Removing unnecessary auctions, started...");
  const auctionsToUpdate = [];
  currentOfferts.forEach((co) => {
    console.log(`Checking offert of: ID ${co.id}, Char Name: ${co.name}`);
    const isInDb = auctionsInDb.find((a) => a.id === co.id);

    if (!isInDb) {
      //Double check cuz website is refreshing
      const isAlreadyAdded = auctionsToUpdate.find((a) => a.id === co.id);

      if (!isAlreadyAdded) auctionsToUpdate.push(co);
    }
  });
  console.log("Removing unnecessary auctions, finished...");

  return auctionsToUpdate;
}

async function updateDbAuction(auctions, type) {
  const charactersInDb = await getCharacters();
  const createdCharacters = [];
  for (var i = 0; i < auctions.length; i++) {
    const data = auctions[i];
    console.log(`Updating DB auctions for ${data.character.name}`);
    var character =
      charactersInDb.find((c) => c.name === data.character.name) ||
      createdCharacters.find((c) => c.name === data.character.name);

    if (!character) {
      const url =
        type === "current"
          ? `https://www.tibia.com/charactertrade/?subtopic=currentcharactertrades&page=details&auctionid=${data.id}&source=overview`
          : `https://www.tibia.com/charactertrade/?subtopic=pastcharactertrades&page=details&auctionid=${data.id}&source=overview`;
      var req = await getRequest(url);

      const details = getCharacterDetails(req);
      character = data.character;
      character.skills = details.skills;
      character.imbuements = details.imbuements;
      character.charms = details.charms;
      character.lastUpdate = Date.now();

      character = await createCharacter(character);
      createdCharacters.push(character);
    }

    if (type === "past") {
      const { id, startDate, endDate, bidInfo, bidValue } = data;
      await createAuction({
        id: id,
        startDate: startDate,
        endDate: endDate,
        bidInfo: bidInfo,
        bidValue: bidValue,
        characterId: character._id,
        status: "Finished",
      });
    }
  }
}

module.exports.main = main;
