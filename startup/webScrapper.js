const config = require("config");
const {
  getRequest,
  dbGetRequest,
  parallelGetRequest,
} = require("../services/httpService");
const {
  createCharacter,
  getCharacterByName,
  getCharacters,
} = require("../services/characterService");
const { createAuction, updateAuction } = require("../services/auctionsService");
const {
  offertsPageCountScrapper,
  getAuctionsFromPage,
  getCharacterFullInfo,
} = require("../services/scrappingService");

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
  const offerts = await getOfferts(pagesCount, pageData.query);
  const auctionsToUpdate = getAuctionsToUpdate(offerts, auctionsInDb);
  await createAuctions(auctionsToUpdate, pageData.type);
  console.log("FInished");
}

async function getOffertsPageCount(url, type) {
  var pageData = await getRequest(url);

  return offertsPageCountScrapper(pageData, type);
}

async function getOfferts(offertsPageCount, query, type) {
  const urls = [];
  for (let index = 1; index <= offertsPageCount; index++) {
    urls.push(query + index);
  }

  const sites = await parallelGetRequest(urls);

  console.log("Scrapping data from readed pages started...");
  const offerts = [];
  sites.forEach((site) => {
    const offertsFromIndexPage = getAuctionsFromPage(site, type);
    offerts.push(...offertsFromIndexPage);
  });
  console.log("Scrapping data from readed pages finished");

  return offerts;
}

function getAuctionsToUpdate(currentOfferts, auctionsInDb) {
  console.log("Removing unnecessary auctions, started...");
  const auctionsToUpdate = [];
  currentOfferts.forEach((co) => {
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

async function createCharacters(data) {
  console.log("Creating characters for scrapped auctions");
  const urls = [];
  data.forEach((value, index) => {
    const url =
      value.type === "current"
        ? `https://www.tibia.com/charactertrade/?subtopic=currentcharactertrades&page=details&auctionid=${value.auctionId}&source=overview`
        : `https://www.tibia.com/charactertrade/?subtopic=pastcharactertrades&page=details&auctionid=${value.auctionId}&source=overview`;
    urls.push(url);
  });

  const characters = await parallelGetRequest(urls, 1);

  characters.forEach((c) => console.log(c.length));
  const createdCharacters = [];
  for (var i = 0; i < characters.length; i++) {
    const data = getCharacterFullInfo(characters[i]);
    data.lastUpdate = Date.now();
    const character = await createCharacter(data);
    createdCharacters.push(character);
  }

  return createdCharacters;
}

async function createAuctions(auctions, type) {
  const charactersInDb = await getCharacters();
  const missingCharactersInDb = [];

  auctions.forEach((a) => {
    if (!charactersInDb.find((c) => c.name === a.character.name)) {
      missingCharactersInDb.push({ auctionId: a.id, type: type });
    }
  });

  const newCharacters = await createCharacters(missingCharactersInDb);
  const updatedCharactersDb = [...charactersInDb, ...newCharacters];

  for (var i = 0; i < auctions.length; i++) {
    const data = auctions[i];
    console.log(`Updating DB auctions for ${data.character.name}`);
    var character = updatedCharactersDb.find(
      (c) => c.name === data.character.name
    );

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
