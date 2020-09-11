const cheerio = require("cheerio");
const {
  offersPagePattern,
  auctionIdPattern,
  auctionHeaderPattern,
} = require("../helpers/regexPatterns");

function getOfferPagesCount(data) {
  const $ = cheerio.load(data);
  var offersPageCount = 0;
  $("a").each((i, e) => {
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

function getAuctionsFromPage(webContent) {
  const $ = cheerio.load(webContent);

  const auctionsIds = [];
  $("a").each((i, e) => {
    if (e.attribs.href) {
      var _url = e.attribs.href;
      var pattern = auctionIdPattern;
      const result = _url.match(pattern);

      if (result) {
        if (!auctionsIds.includes(Number(result[1])))
          auctionsIds.push(Number(result[1]));
      }
    }
  });

  const charactersData = [];
  const headers = $(".AuctionHeader").text();
  const headersPattern = auctionHeaderPattern;
  var result = headers.match(headersPattern);

  while (true) {
    const char = {};
    char.name = result[1];
    char.level = Number(result[2]);
    char.vocation = result[3];
    char.gender = result[4];
    char.world = result[5];

    charactersData.push(char);

    if (result.input.length === result[0].length) {
      break;
    } else {
      result = result.input.substr(result[0].length, result.input.length);
      result = result.match(headersPattern);
    }
  }

  var auctions = [];
  for (var i = 0; i < charactersData.length; i++) {
    var auction = {
      auctionId: auctionsIds[i],
      auctionedCharacter: charactersData[i],
    };

    auctions.push(auction);
  }

  console.log(auctions);
}

const forLoop = async (_) => {
  for (let index = 0; index < fruitsToGet.length; index++) {
    const fruit = fruitsToGet[index];
    const numFruit = await getNumFruit(fruit);
    console.log(numFruit);
  }
};

module.exports.getOfferPagesCount = getOfferPagesCount;
module.exports.getAuctionsFromPage = getAuctionsFromPage;
