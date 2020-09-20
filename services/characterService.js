const config = require("config");
const port = config.get("port");
const endpoint = "http://localhost:" + port + "/api/characters";
const axios = require("axios");

async function createCharacter(c) {
  console.log(`Create Character Service, DATA: ${c.name}`);
  try {
    const { data } = await axios.post(endpoint, {
      name: c.name,
      vocation: c.vocation,
      level: c.level,
      world: c.world,
      gender: c.gender,
      skills: c.skills,
      imbuements: c.imbuements,
      charms: c.charms,
      lastUpdate: c.lastUpdate,
    });
    console.log("Creating character: ", data.name);
    return data;
  } catch (error) {
    console.log(error.response.data);
  }
}

async function getCharacters() {
  try {
    const { data } = await axios.get(endpoint);
    return data;
  } catch (error) {
    console.log(error.response.data);
  }
}

async function getCharacterByName(name) {
  try {
    const { data } = await axios.get(endpoint);
    const character = data.find((d) => d.name === name);
    return character || null;
  } catch (error) {
    return error.response.data;
  }
}

module.exports.createCharacter = createCharacter;
module.exports.getCharacterByName = getCharacterByName;
module.exports.getCharacters = getCharacters;
