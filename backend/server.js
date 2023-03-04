const fs = require("fs");
const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const uuidv4 = require("uuid/v4")

const Monster = require("./models/monster");

const app = express();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "logs", "access.log"),
  { flags: "a" }
);

app.use(morgan("combined", { stream: accessLogStream }));

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/api/monsters", async (req, res) => {
  console.log("TRYING TO FETCH MONSTERS");
  try {
    const monsters = await Monster.find();
    res.status(200).json({
      monsters: monsters.map((monster) => ({
        id: monster.id,
        name: monster.name,
        image: monster.image,
      })),
    });
    console.log("FETCHED MONSTERS");
  } catch (err) {
    console.error("ERROR FETCHING MONSTERS");
    console.error(err.message);
    res.status(500).json({ message: "Failed to load monsters." });
  }
});

app.post("/api/monsters", async (req, res) => {
  console.log("TRYING TO STORE MONSTER");
  const monsterID = uuidv4()
  const monsterName = req.body.name;
  const monsterImage = `https://robohash.org/${req.body.name.replace(
    /\s/g,
    ""
  )}?set=set2`

  if (!monsterName || monsterName.trim().length === 0) {
    console.log("INVALID INPUT - NO TEXT");
    return res.status(422).json({ message: "Invalid monster name." });
  }

  const monster = new Monster({
    id: monsterID,
    name: monsterName,
    image: monsterImage,
  });

  try {
    await monster.save();
    res
      .status(201)
      .json({
        message: "Monster saved",
        monster: { id: monsterID, name: monsterName, image:  monsterImage},
      });
    console.log("STORED NEW MONSTER");
  } catch (err) {
    console.error("ERROR FETCHING MONSTERS");
    console.error(err.message);
    res.status(500).json({ message: "Failed to save monster." });
  }
});

app.delete("/api/monsters/:id", async (req, res) => {
  console.log("TRYING TO DELETE MONSTER");
  try {
    await Monster.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Deleted monster!" });
    console.log("DELETED MONSTER");
  } catch (err) {
    console.error("ERROR FETCHING MONSTERS");
    console.error(err.message);
    res.status(500).json({ message: "Failed to delete monster." });
  }
});

mongoose.connect(
  `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@mongodb:27017/monsters-inc?authSource=admin`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.error("FAILED TO CONNECT TO MONGODB");
      console.error(err);
    } else {
      console.log("CONNECTED TO MONGODB!!");
      app.listen(8080);
    }
  }
);
