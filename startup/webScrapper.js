const c = require("config");
const config = require("config");
const { getRequest, dbGetRequest } = require("../services/httpService");
const {
  createCharacter,
  getCharacterByName,
} = require("../services/characterService");
const {
  getOfferPagesCount,
  getAuctionsFromPage,
  getCharacterDetails,
} = require("../services/scrappingService");

module.exports = async function () {
  const port = config.get("port");

  const auctionsInDb = await dbGetRequest(
    "http://localhost:" + port + "/api/auctions"
  );

  /*var mainPageData = await getRequest(
    "https://www.tibia.com/charactertrade/?subtopic=currentcharactertrades"
  );

  var offersPageCount = getOfferPagesCount(mainPageData);
*/
  const currentOfferts = [];
  for (let index = 1; index <= 1; index++) {
    var offersPage = await getRequest(
      `https://www.tibia.com/charactertrade/?subtopic=currentcharactertrades&filter_profession=0&filter_levelrangefrom=0&filter_levelrangeto=0&filter_world=&filter_worldpvptype=9&filter_worldbattleyestate=0&filter_skillid=&filter_skillrangefrom=0&filter_skillrangeto=0&order_column=101&order_direction=1&currentpage=${index}`
    );

    const offertsFromIndexPage = getAuctionsFromPage(offersPage);
    currentOfferts.push(...offertsFromIndexPage);
  }

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

  for (var i = 0; i < auctionsToUpdate.length; i++) {
    const data = auctionsToUpdate[i];
    var character = await getCharacterByName(data.newValue.character.name);
    if (
      Object.keys(auctionsToUpdate[i].oldValue).length === 0 ||
      character === null
    ) {
      var req = await getRequest(
        `https://www.tibia.com/charactertrade/?subtopic=currentcharactertrades&page=details&auctionid=${data.newValue.id}&source=overview`
      );

      if (character === null) {
        const details = getCharacterDetails(req);
        character = data.newValue.character;
        character.skills = details.skills;
        character.imbuements = details.imbuements;
        character.charms = details.charms;

        await createCharacter(character);
      }
    }
  }
  /*
  var req = await getRequest(
    "https://www.tibia.com/charactertrade/?subtopic=currentcharactertrades&page=details&auctionid=90494&source=overview"
  );

  getCharacterDetails(req);*/
};
