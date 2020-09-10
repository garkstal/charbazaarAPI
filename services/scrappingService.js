const cheerio = require("cheerio");
const { offersPagePattern } = require("../helpers/regexPatterns");

function getOfferPagesCount(data) {
  const $ = cheerio.load(data);
  var offersPageCount = 0;
  const offersPageCountData = $("a").each((i, e) => {
    if (e.attribs.href) {
      var _url = e.attribs.href;
      var pattern = offersPagePattern;
      const result = _url.match(pattern);

      if (result) {
        offersPageCount =
          Number(result[1]) > offersPageCount
            ? Number(result[1])
            : offersPageCount;
      }
    }
  });

  return offersPageCount;
}

function getAuctionsFromPage(pageId) {
  const auctions = [];
}

const forLoop = async (_) => {
  for (let index = 0; index < fruitsToGet.length; index++) {
    const fruit = fruitsToGet[index];
    const numFruit = await getNumFruit(fruit);
    console.log(numFruit);
  }
};

module.exports.getOfferPagesCount = getOfferPagesCount;
