const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  categories: Array,
  name: { type: String, required: true },
  description: { type: String },
  sizes: [{}],
  price: { type: Number, required: true },
  color: [{}],
  image: { type: String, default: null },
});

module.exports = mongoose.model('Product', productSchema);
