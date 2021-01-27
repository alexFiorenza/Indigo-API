const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const ordersSchema = new mongoose.Schema({
  price: { type: Number, required: true },
  products: [{}],
  user: { type: Object },
  date: { type: String },
  delayTime: { type: String },
  status: { type: String },
  paid: { type: Boolean, default: false },
  paymentMethod: { type: Object },
  deliveryMethod: { type: String, required: true },
  trackingId: { type: String, required: true, default: uuidv4() },
  instructions: { type: String },
  createdAt: { type: String, default: new Date() },
});

module.exports = mongoose.model('Order', ordersSchema);
