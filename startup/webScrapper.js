const { getRequest } = require("../services/httpService");
const {
  getOfferPagesCount,
  getAuctionsFromPage,
} = require("../services/scrappingService");

module.exports = async function () {
  var mainPageData = await getRequest(
    "https://www.tibia.com/charactertrade/?subtopic=currentcharactertrades"
  );

  var offersPageCount = getOfferPagesCount(mainPageData);

  const currentOfferts = [];
  for (let index = 0; index < offersPageCount; index++) {
    var offersPage = await getRequest(
      `https://www.tibia.com/charactertrade/?subtopic=currentcharactertrades&filter_profession=0&filter_levelrangefrom=0&filter_levelrangeto=0&filter_world=&filter_worldpvptype=9&filter_worldbattleyestate=0&filter_skillid=&filter_skillrangefrom=0&filter_skillrangeto=0&order_column=101&order_direction=1&currentpage=${index}`
    );

    const offertsFromIndexPage = getAuctionsFromPage(offersPage);
    currentOfferts.push(...offertsFromIndexPage);
  }

  console.log(currentOfferts);
};
