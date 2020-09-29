const { getRequest, parallelGetRequest } = require("../services/httpService");
const {
  createCharacter,
  getCharacters,
} = require("../services/characterService");
const { createAuction, getAuctions } = require("../services/auctionsService");
const {
  offertsPageCountScrapper,
  getAuctionsFromPage,
  getCharacterFullInfo,
  getItemsFromWiki,
} = require("../services/scrappingService");

async function main() {
  const pageData = {
    url: "https://www.tibia.com/charactertrade/?subtopic=pastcharactertrades",
    query:
      "https://www.tibia.com/charactertrade/?subtopic=pastcharactertrades&currentpage=",
    type: "past",
  };

  const pagesCount = await getOffertsPageCount(pageData.url, pageData.type);
  const offerts = await getOfferts(pagesCount, pageData.query);
  await processOfferts(offerts, pageData.type);
}

async function getOffertsPageCount(url, type) {
  var pageData = await getRequest(url);

  return offertsPageCountScrapper(pageData, type);
}

async function getOfferts(offertsPageCount, query, type) {
  const urls = [];
  for (var index = 1; index <= offertsPageCount; index++) {
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

  console.log("Get offerts, offerts count: ", offerts.length);
  return offerts;
}

async function processOfferts(offerts, type) {
  const auctionsInDb = await getAuctions();
  const charactersInDb = await getCharacters();
  const charNames =
    charactersInDb.map((c) => {
      return c.name;
    }) || [];
  const auctionIds =
    auctionsInDb.map((a) => {
      return a.id;
    }) || [];

  const allAuctions = [...auctionIds];
  const allCharacters = [...charNames];
  for (var i = offerts.length - 1; i > 0; i--) {
    const currentOffert = offerts[i];
    const auctionIsInDb = allAuctions.find((a) => a === currentOffert.id);
    const charIsInDb = allCharacters.find(
      (c) => c === currentOffert.character.name
    );

    var char;
    if (!charIsInDb) {
      const url =
        type === "past"
          ? `https://www.tibia.com/charactertrade/?subtopic=pastcharactertrades&page=details&auctionid=${currentOffert.id}&source=overview`
          : `https://www.tibia.com/charactertrade/?subtopic=currentcharactertrades&page=details&auctionid=${currentOffert.id}&source=overview`;
      webData = await getRequest(url);
      char = getCharacterFullInfo(webData);
      char.lastUpdate = Date.now();
      char = await createCharacter(char);
      allCharacters.push(char.name);
    }

    if (!auctionIsInDb) {
      const { id, startDate, endDate, bidInfo, bidValue } = offerts[i];
      const auction = await createAuction({
        id: id,
        startDate: startDate,
        endDate: endDate,
        bidInfo: bidInfo,
        bidValue: bidValue,
        characterId: char._id,
        status: "Finished",
      });
      allAuctions.push(auction.id);
    }

    offerts.splice(i, 1);
  }
}

async function downloadItemsData() {
  const url = "https://tibia.fandom.com/wiki/Item_IDs";
  const wikiPageData = await getRequest(url);

  const items = getItemsFromWiki(wikiPageData);

  console.log(items.find((i) => i.name === "Magnificent Trunk"));
}

module.exports.main = main;
module.exports.downloadItemsData = downloadItemsData;
