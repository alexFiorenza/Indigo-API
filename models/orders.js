const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');
const uniqueid = customAlphabet('0123456789', 5);
const ordersSchema = new mongoose.Schema({
  price: { type: Number, required: true },
  products: [{}],
  user: { type: Object },
  date: { type: String },
  status: { type: String },
  paid: { type: Boolean, default: false },
  paymentData: { type: Object },
  deliveryMethod: { type: String, required: true },
  trackingDeliveryData: { type: Object },
  trackingId: { type: String, required: true, default: uniqueid() },
  instructions: { type: String },
  createdAt: { type: String, default: new Date() },
  branch_office: { type: Object },
  costToSend: { type: Number },
});

module.exports = mongoose.model('Order', ordersSchema);
