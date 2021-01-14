const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const productSchema = new mongoose.Schema({
  categories: Array,
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  color: [{}],
  images: [{}],
  weight: { type: Number },
  top: { type: Boolean, default: false },
  sale: { type: Number, default: 0 },
  homeView: { type: Boolean, default: false },
  stock: { type: Boolean, default: true },
  categories: [{}],
});
productSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Product', productSchema);
