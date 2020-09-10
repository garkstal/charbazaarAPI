const { getRequest } = require("./services/httpService");
const { getOfferPagesCount } = require("./services/scrappingService");

async function main() {
  var mainPageData = await getRequest(
    "https://www.tibia.com/charactertrade/?subtopic=currentcharactertrades"
  );

  var offersPageCount = getOfferPagesCount(mainPageData);

  console.log(offersPageCount);
}

main();
