const cheerio = require("cheerio");
const {
  offersPagePattern,
  auctionIdPattern,
  auctionHeaderPattern,
  auctionDatesAndBidPattern,
  characterSkillsPattern,
  charmPointsPattern,
  obtainedCharmsPattern,
  imbuementsPattern,
} = require("../helpers/regexPatterns");
const { convertMonthShortcutToNumber } = require("../utils/utils");
const { charms, imbuements } = require("../helpers/constants");

function getOfferPagesCount(data) {
  const $ = cheerio.load(data);
  var offersPageCount = 0;
  $("a").each((i, e) => {
    if (e.attribs.href) {
      var _url = e.attribs.href;
      const result = _url.match(offersPagePattern);

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
    info.start = new Date(
      result[3],
      convertMonthShortcutToNumber(result[1]),
      result[2],
      result[4],
      result[5]
    );
    info.end = new Date(
      result[8],
      convertMonthShortcutToNumber(result[6]),
      result[7],
      result[9],
      result[10]
    );

    info.isBided = result[11] === "Minimum Bid" ? true : false;
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
    skills.push({
      type: result[1],
      level: Number(result[2]),
      progres: result[3],
    });

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

  const availableCharms = [];
  result = webContent.match(obtainedCharmsPattern);
  while (true) {
    if (charms.includes(result[1])) {
      availableCharms.push(result[1]);
    }

    newString = result.input.substr(result.index + result[0].length);
    result = newString.match(obtainedCharmsPattern);

    if (!result) break;
  }

  data.availableCharms = availableCharms;

  return data;
}

function scrapCharacterImbuements(webContent) {
  const imbus = [];
  result = webContent.match(imbuementsPattern);
  while (true) {
    if (imbuements.includes(result[1])) {
      imbus.push(result[1]);
    }

    newString = result.input.substr(result.index + result[0].length);
    result = newString.match(imbuementsPattern);

    if (!result) break;
  }

  console.log(imbus);
  return imbus;
}

function getCharacterDetails(webContent) {
  const skills = scrapCharacterSkills(webContent);
  const charms = scrapCharacterCharms(webContent);
  const imbuements = scrapCharacterImbuements(webContent);
}

function getAuctionsFromPage(webContent) {
  const $ = cheerio.load(webContent);

  var auctionsIds = scrapAuctionIds($);
  var auctionsCharacters = scrapCharacterData($);
  var auctionDatesAndBids = scrapAuctionsDatesAndBid($);

  var auctions = [];
  for (var i = 0; i < auctionsIds.length; i++) {
    var auction = {
      auctionId: auctionsIds[i],
      auctionedCharacter: auctionsCharacters[i],
      auctionBid: auctionDatesAndBids[i].bidValue,
      auctionIsBided: auctionDatesAndBids[i].isBided,
      auctionStart: auctionDatesAndBids[i].start,
      auctionEnd: auctionDatesAndBids[i].end,
    };

    auctions.push(auction);
  }

  return auctions;
}

module.exports.getOfferPagesCount = getOfferPagesCount;
module.exports.getAuctionsFromPage = getAuctionsFromPage;
module.exports.scrapCharacterImbuements = scrapCharacterImbuements;
