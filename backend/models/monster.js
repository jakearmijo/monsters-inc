const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const monsterSchema = new Schema({
  name: String,
  image: String,
});

const MonsterModel = mongoose.model('Monster', monsterSchema);

module.exports = MonsterModel;