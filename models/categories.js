const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  subcategories: { type: Array, required: false },
});

module.exports = mongoose.model('Category', categorySchema);
