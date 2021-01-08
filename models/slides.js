const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema({
  title: { type: String, required: true },
  images: [{}],
  description: String,
  button: String,
  color: String,
  btnDirection: String,
  wordsColor: String,
});
module.exports = mongoose.model('Slide', slideSchema);
