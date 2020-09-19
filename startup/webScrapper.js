const c = require("config");
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

async function main() {
  const port = config.get("port");

  const auctionsInDb = await dbGetRequest(
    "http://localhost:" + port + "/api/auctions"
  );

  const offertsPageCount = await getOffersPageCount();
  const currentOfferts = await getCurrentOfferts(3);
  const auctionsToUpdate = getAuctionsToUpdate(currentOfferts, auctionsInDb);
  await updateDbAuction(auctionsToUpdate);

  console.log("Scrapping website finished.");
}

async function getOffersPageCount() {
  var mainPageData = await getRequest(
    "https://www.tibia.com/charactertrade/?subtopic=currentcharactertrades"
  );

  return offertsPageCountScrapper(mainPageData);
}

async function getCurrentOfferts(offertsPageCount) {
  const currentOfferts = [];
  for (let index = 1; index <= offertsPageCount; index++) {
    var offersPage = await getRequest(
      `https://www.tibia.com/charactertrade/?subtopic=currentcharactertrades&filter_profession=0&filter_levelrangefrom=0&filter_levelrangeto=0&filter_world=&filter_worldpvptype=9&filter_worldbattleyestate=0&filter_skillid=&filter_skillrangefrom=0&filter_skillrangeto=0&order_column=101&order_direction=1&currentpage=${index}`
    );

    const offertsFromIndexPage = getAuctionsFromPage(offersPage);
    currentOfferts.push(...offertsFromIndexPage);
  }

  return currentOfferts;
}

function getAuctionsToUpdate(currentOfferts, auctionsInDb) {
  const auctionsToUpdate = [];
  currentOfferts.forEach((co) => {
    const isInDb = auctionsInDb.find((a) => a.id === id);

    if (!isInDb || isInDb.bidValue !== co.bidValue) {
      auctionsToUpdate.push({
        dbData: isInDb || {},
        webData: co,
      });
    }
  });

  return auctionsToUpdate;
}

async function updateDbAuction(auctions) {
  const charactersInDb = await getCharacters();
  for (var i = 0; i < auctions.length; i++) {
    const data = auctions[i];
    var character =
      charactersInDb.find((c) => c.name === data.webData.character.name) ||
      null;
    if (character === null) {
      var req = await getRequest(
        `https://www.tibia.com/charactertrade/?subtopic=currentcharactertrades&page=details&auctionid=${data.webData.id}&source=overview`
      );

      const details = getCharacterDetails(req);
      character = data.webData.character;
      character.skills = details.skills;
      character.imbuements = details.imbuements;
      character.charms = details.charms;

      character = await createCharacter(character);
      const { id, startDate, endDate, isBided, bidValue } = data.webData;
      await createAuction({
        id: id,
        startDate: startDate,
        endDate: endDate,
        isBided: isBided,
        bidValue: bidValue,
        characterId: character._id,
      });
    }
  }
}

module.exports.main = main;
