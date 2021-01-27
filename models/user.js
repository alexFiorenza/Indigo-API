const mongoose = require('mongoose');
const moment = require('moment');
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  province: { type: String, required: true },
  town: { type: String, required: true },
  street: { type: String, required: true },
  numberStreet: { type: String, required: true },
  role: { type: String, default: 'user' },
  cp: { type: Number },
  phone: { type: Number },
  building: { type: String },
  createdAt: { type: String, default: new Date() },
  favorites: [{}],
});
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};
module.exports = mongoose.model('User', userSchema);
