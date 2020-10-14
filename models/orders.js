const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema({
  price: { type: Number, required: true },
  products: [{}],
  user: { type: Object },
  date: { type: String },
  delayTime: { type: Number },
  status: { type: String },
  paid: { type: Boolean, default: false },
  paymentMethod: { type: Object },
});

module.exports = mongoose.model('Order', ordersSchema);
