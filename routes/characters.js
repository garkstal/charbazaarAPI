const express = require("express");
const router = express.Router();
const { Character } = require("../models/character");

router.get("/", async (req, res) => {
  const characters = await Character.find();

  res.send(characters);
});

router.get("/:id", async (req, res) => {
  const character = await Character.findById(req.params.id);

  if (character)
    return res.status(400).send("Character with this ID does not exists.");

  res.send(character);
});

router.post("/", async (req, res) => {
  /*const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);*/

  const character = await Character.findOne({ name: req.body.name });
  if (character)
    return res.status(400).send("Character with this name already exist.");

  const {
    name,
    vocation,
    level,
    world,
    gender,
    skills,
    imbuements,
    charms,
  } = req.body;

  var _character = new Character({
    name: name,
    vocation: vocation,
    level: level,
    world: world,
    gender: gender,
    skills: skills,
    imbuements: imbuements,
    charms: charms,
  });

  await _character.save(_character);
  res.send(_character);
});

router.delete("/:id", async (req, res) => {
  const character = await Character.findByIdAndRemove(req.params.id, {
    useFindAndModify,
  });

  if (!character)
    return res.status(404).send("Character with given ID does not exist.");

  res.send(character);
});

module.exports = router;
