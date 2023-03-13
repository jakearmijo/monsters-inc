const fs = require("fs");
const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const Monster = require("./models/monster");

require('dotenv').config();

const seedData = [
  {
    name: "Mike Wazowski",
    image: "https://robohash.org/MikeWazowski?set=set2",
  },
  {
    name: "Randall Boggs",
    image: "https://robohash.org/RandallBoggs?set=set2",
  },
  {
    name: "James P. Sullivan",
    image: "https://robohash.org/JamesPSullivan?set=set2",
  },
  {
    name: "Roz",
    image: "https://robohash.org/Roz?set=set2",
  },
  {
    name: "Boo",
    image: "https://robohash.org/Boo?set=set2",
  },
  {
    name: "CDA",
    image: "https://robohash.org/CDA?set=set2",
  },
  {
    name: "Celia Mae",
    image: "https://robohash.org/CeliaMae?set=set2",
  },
  {
    name: "Henry J. Waternoose",
    image: "https://robohash.org/RoHenryJWaternoose?set=set2",
  },
];

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
        _id: monster._id,
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
  const monsterName = req.body.name;
  const monsterImage = req.body.image;

  if (!monsterName || monsterName.trim().length === 0) {
    console.log("INVALID INPUT - NO TEXT");
    return res.status(422).json({ message: "Invalid monster name." });
  }

  const monster = new Monster({
    name: monsterName,
    image: monsterImage,
  });

  try {
    await monster.save();
    res.status(201).json({
      message: "Monster saved",
      monster: { _id: monster._id , name: monster.name, image: monster.image },
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
  `mongodb+srv://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.MONGODB_URL}/?retryWrites=true&w=majority`,
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

// const seedDB = async () => {
//   await Monster.insertMany(seedData);
// };
// seedDB()
