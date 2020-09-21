const cheerio = require("cheerio");
const {
  currentOffertsPagePattern,
  pastOffertsPagePattern,
  auctionIdPattern,
  auctionHeaderPattern,
  auctionDatesAndBidPattern,
  characterSkillsPattern,
  charmPointsPattern,
  obtainedCharmsPattern,
  imbuementsPattern,
} = require("../helpers/regexPatterns");
const {
  convertMonthShortcutToNumber,
  createDateObject,
} = require("../utils/utils");
const {
  charms,
  imbuements,
  auctionBidStatuses,
} = require("../helpers/constants");

function offertsPageCountScrapper(data, type) {
  const pattern =
    type === "current" ? currentOffertsPagePattern : pastOffertsPagePattern;
  const $ = cheerio.load(data);
  var offertsPageCount = 0;
  $("a").each((i, e) => {
    if (e.attribs.href) {
      var _url = e.attribs.href;
      const result = _url.match(pattern);

      if (result) {
        offertsPageCount =
          Number(result[1]) > offertsPageCount
            ? Number(result[1])
            : offertsPageCount;
      }
    }
  });

  if (offertsPageCount === 0) {
    console.error(
      "----------------------------------KURWY ZMIENIŁY PATTERN W MAKSYMALNEJ LIBCZIE STRON, ZOBACZ ZIOMECZKU URL----------------------------------"
    );
  }

  return offertsPageCount;
}

function scrapAuctionIds(cheerioData) {
  const auctionsIds = [];
  cheerioData("a").each((i, e) => {
    if (e.attribs.href) {
      var _url = e.attribs.href;
      const result = _url.match(auctionIdPattern);

      if (result) {
        if (!auctionsIds.includes(Number(result[1])))
          auctionsIds.push(Number(result[1]));
      }
    }
  });

  return auctionsIds;
}

function scrapCharacterData(cheerioData) {
  const charactersData = [];
  const headers = cheerioData(".AuctionHeader").text();
  var result = headers.match(auctionHeaderPattern);

  console.log(result);
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
      result = result.match(auctionHeaderPattern);
    }
  }

  return charactersData;
}

function scrapAuctionsDatesAndBid(cheerioData) {
  const data = [];
  const auctions = cheerioData(".ShortAuctionData").text();
  var result = auctions.match(auctionDatesAndBidPattern);

  while (true) {
    const info = {};
    info.startDate = createDateObject(
      result[3],
      convertMonthShortcutToNumber(result[1]),
      result[2],
      result[4],
      result[5]
    );

    info.endDate = createDateObject(
      result[8],
      convertMonthShortcutToNumber(result[6]),
      result[7],
      result[9],
      result[10]
    );

    info.bidInfo =
      result[11] === "Minimum Bid"
        ? auctionBidStatuses.auctionNotBided
        : auctionBidStatuses.auctionBided;
    info.bidValue = Number(result[12].replace(",", ""));
    data.push(info);

    if (result.input.length === result[0].length) {
      break;
    } else {
      result = result.input.substr(result[0].length, result.input.length);
      result = result.match(auctionDatesAndBidPattern);
    }
  }

  return data;
}

function scrapCharacterSkills(webContent) {
  var result = webContent.match(characterSkillsPattern);
  const skills = [];

  while (true) {
    skills.push(result[1], result[2], result[3]);

    newString = result.input.substr(result.index + result[0].length);
    result = newString.match(characterSkillsPattern);

    if (!result) break;
  }

  return skills;
}

function scrapCharacterCharms(webContent) {
  var result = webContent.match(charmPointsPattern);

  const data = {
    expansion: result[1] === "yes" ? true : false,
    unusedPoints: Number(result[2].replace(",", "")),
    usedPoints: Number(result[3].replace(",", "")),
  };

  const available = [];
  result = webContent.match(obtainedCharmsPattern);
  if (result) {
    while (true) {
      if (charms.includes(result[1])) {
        available.push(result[1]);
      }

      newString = result.input.substr(result.index + result[0].length);
      result = newString.match(obtainedCharmsPattern);

      if (!result) break;
    }
  }

  data.available = available;

  return data;
}

function scrapCharacterImbuements(webContent) {
  const imbus = [];
  result = webContent.match(imbuementsPattern);
  if (result) {
    while (true) {
      if (imbuements.includes(result[1])) {
        imbus.push(result[1]);
      }

      newString = result.input.substr(result.index + result[0].length);
      result = newString.match(imbuementsPattern);

      if (!result) break;
    }
  }

  return imbus;
}

function getCharacterDetails(webContent) {
  const skills = scrapCharacterSkills(webContent);
  const charms = scrapCharacterCharms(webContent);
  const imbuements = scrapCharacterImbuements(webContent);

  return { skills: skills, charms: charms, imbuements: imbuements };
}

function getAuctionsFromPage(webContent) {
  const $ = cheerio.load(webContent);

  var auctionsIds = scrapAuctionIds($);
  var auctionsCharacters = scrapCharacterData($);
  var auctionDatesAndBids = scrapAuctionsDatesAndBid($);

  var auctions = [];
  for (var i = 0; i < auctionsIds.length; i++) {
    var auction = {
      id: auctionsIds[i],
      character: auctionsCharacters[i],
      bidValue: auctionDatesAndBids[i].bidValue,
      bidInfo: auctionDatesAndBids[i].bidInfo,
      startDate: auctionDatesAndBids[i].startDate,
      endDate: auctionDatesAndBids[i].endDate,
    };

    auctions.push(auction);
  }

  return auctions;
}

module.exports.offertsPageCountScrapper = offertsPageCountScrapper;
module.exports.getAuctionsFromPage = getAuctionsFromPage;
module.exports.getCharacterDetails = getCharacterDetails;
