const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const productSchema = new mongoose.Schema({
  categories: Array,
  name: { type: String, required: true },
  description: { type: String },
  sizes: [{}],
  price: { type: Number, required: true },
  color: [{}],
  image: [],
  weight: { type: Number },
});
productSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Product', productSchema);
