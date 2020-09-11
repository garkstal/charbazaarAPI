const { getRequest } = require("./services/httpService");
const {
  getOfferPagesCount,
  getAuctionsFromPage,
} = require("./services/scrappingService");

async function main() {
  var mainPageData = await getRequest(
    "https://www.tibia.com/charactertrade/?subtopic=currentcharactertrades"
  );

  var offersPageCount = getOfferPagesCount(mainPageData);

  var offersPage = await getRequest(
    "https://www.tibia.com/charactertrade/?subtopic=currentcharactertrades&filter_profession=0&filter_levelrangefrom=0&filter_levelrangeto=0&filter_world=&filter_worldpvptype=9&filter_worldbattleyestate=0&filter_skillid=&filter_skillrangefrom=0&filter_skillrangeto=0&order_column=101&order_direction=1&currentpage=2"
  );

  getAuctionsFromPage(offersPage);
}

main();
