const mongoose = require('mongoose');
const { any, object } = require('underscore');

const slideSchema = new mongoose.Schema({
  title: { type: String, required: true },
  images: [{}],
  description: String,
  button: String,
  color: String,
  btnDirection: { type: Object },
  wordsColor: String,
});
module.exports = mongoose.model('Slide', slideSchema);
