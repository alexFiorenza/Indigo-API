const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/user');

//TODO Finish get a user per given id
const getOneUserPerId = (req, res) => {
  console.log(req.params.id);
};
//TODO Finish register User
const registerUser = (req, res) => {
  const body = req.body;
  const data = _.pick([
    'name',
    'email',
    'province',
    'municipality',
    'street',
    'password',
  ]);
};
module.exports = {
  getOneUserPerId,
  registerUser,
};
