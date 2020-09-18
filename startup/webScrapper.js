const c = require("config");
const config = require("config");
const { getRequest, dbGetRequest } = require("../services/httpService");
const {
  createCharacter,
  getCharacterByName,
  getCharacters,
} = require("../services/characterService");
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
  const currentOfferts = await getCurrentOfferts(offertsPageCount);
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
        oldValue: isInDb || {},
        newValue: co,
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
      charactersInDb.find((c) => c.name === data.newValue.character.name) ||
      null;
    if (character === null) {
      var req = await getRequest(
        `https://www.tibia.com/charactertrade/?subtopic=currentcharactertrades&page=details&auctionid=${data.newValue.id}&source=overview`
      );

      const details = getCharacterDetails(req);
      character = data.newValue.character;
      character.skills = details.skills;
      character.imbuements = details.imbuements;
      character.charms = details.charms;

      await createCharacter(character);
    }
  }
}

module.exports.main = main;
