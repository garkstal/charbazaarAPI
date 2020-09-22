const cheerio = require("cheerio");
const {
  currentOffertsPagePattern,
  pastOffertsPagePattern,
  auctionHeaderPatternDetailed,
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

function scrapCharacterData(webContent) {
  console.log("Scrapping character basic data started.");
  const charactersData = [];
  var result = webContent.match(auctionHeaderPattern);

  while (true) {
    const data = {
      character: {},
    };

    data.id = Number(result[1]);
    data.character.name = result[2];
    data.character.level = Number(result[3]);
    data.character.vocation = result[4];
    data.character.gender = result[5];
    data.character.world = result[6];

    charactersData.push(data);

    newString = result.input.substr(result.index + result[0].length);
    result = newString.match(auctionHeaderPattern);

    if (!result) break;
  }
  console.log("Scrapping character basic data finished.");

  return charactersData;
}

function scrapCharacterDataDetailed(webContent) {
  console.log("Scrapping detailed data character started.");
  const result = webContent.match(auctionHeaderPatternDetailed);

  const character = {};
  character.name = result[1];
  character.level = Number(result[2]);
  character.vocation = result[3];
  character.gender = result[4];
  character.world = result[5];

  console.log("Scrapping detailed data character finished.");
  return character;
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
  console.log("Scrapping character skills data started.");
  var result = webContent.match(characterSkillsPattern);
  const skills = [];

  while (true) {
    skills.push(result[1], result[2], result[3]);

    newString = result.input.substr(result.index + result[0].length);
    result = newString.match(characterSkillsPattern);

    if (!result) break;
  }

  console.log("Scrapping character skills data finished.");

  return skills;
}

function scrapCharacterCharms(webContent) {
  console.log("Scrapping character charms data started.");
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

  console.log("Scrapping character charms data finished.");
  return data;
}

function scrapCharacterImbuements(webContent) {
  console.log("Scrapping character imbuements data started.");
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

  console.log("Scrapping character imbuements data finished.");
  return imbus;
}

function getCharacterFullInfo(webContent) {
  console.log(webContent.substr(0, 100));
  const character = scrapCharacterDataDetailed(webContent);
  const skills = scrapCharacterSkills(webContent);
  const charms = scrapCharacterCharms(webContent);
  const imbuements = scrapCharacterImbuements(webContent);

  character.skills = skills;
  character.charms = charms;
  character.imbuements = imbuements;

  return character;
}

function getAuctionsFromPage(webContent) {
  const $ = cheerio.load(webContent);

  var auctionsCharacters = scrapCharacterData(webContent);
  var auctionDatesAndBids = scrapAuctionsDatesAndBid($);

  var auctions = [];
  for (var i = 0; i < auctionsCharacters.length; i++) {
    var auction = {
      id: auctionsCharacters[i].id,
      character: auctionsCharacters[i].character,
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
module.exports.getCharacterFullInfo = getCharacterFullInfo;
