const {
  getCharacters,
  getCharacterById,
} = require("../services/characterService");
const { getAuctions } = require("../services/auctionsService");
var fs = require("fs");

async function retrieveData(info) {
  const data = {
    voc: "knight",
    levelRange: [460, 500],
  };

  var characters = await getCharacters();

  const filteredCharacters = characters.filter(
    (c) =>
      c.vocation.toLowerCase().indexOf(data.voc) !== -1 &&
      c.level >= data.levelRange[0] &&
      c.level <= data.levelRange[1]
  );

  const charIds = getCharacterIds(filteredCharacters);
  const auctions = await getAuctions();

  const filteredAuctions = auctions.filter((a) =>
    charIds.includes(a.characterId)
  );

  var text = "";
  filteredAuctions.forEach((auction) => {
    filteredCharacters.forEach((character) => {
      if (auction.characterId === character._id) {
        auction.character = character;
        text += `Auction Id: ${auction.id}\nCharacter Name: ${character.name}\nLevel: ${character.level}\nSkill: ${character.skills}\nCzy został sprzedany: ${auction.bidInfo}\nZa ile został sprzedany/wystawiony: ${auction.bidValue}\nŚwiat: ${character.world}\nImbu: ${character.imbuements}\nCharm Expansion: ${character.charms[0].charmExpansion}\nCharm Used Points: ${character.charms[0].usedPoints}\nCharm Not Used Points: ${character.charms[0].unusedPoints}\nAvailable Charms: ${character.charms[0].available}\n-----------------------------------------------------------------------------------------------------------\n`;
      }
    });
  });

  fs.writeFile("knighty.txt", text, (err) => {
    if (err) throw err;

    console.log("zapisane.");
  });
}

function getCharacterIds(characters) {
  return characters.map((c) => {
    return c._id;
  });
}

module.exports.retrieveData = retrieveData;
