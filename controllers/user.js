const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/user');

//TODO Finish get a user per given id
const getOneUserPerId = (req, res) => {
  const { id } = req.params;
};
/*Register one user*/
const registerUser = (req, res) => {
  const body = req.body;
  const saltRounds = 10;
  const data = _.pick(body, [
    'name',
    'email',
    'province',
    'municipality',
    'street',
  ]);
  const password = body.password;
  const encryptedPassword = bcrypt.hashSync(password, saltRounds);
  Object.assign(data, { password: encryptedPassword });
  User.find({ email: data.email }, (err, userFound) => {
    if (err) {
      return res.status(500).json({ status: false, err });
    }
    if (userFound.length > 0) {
      return res.status(500).json({
        status: false,
        err: 'There is already a user with that email',
      });
    }
    User.create(data, (err) => {
      if (err) {
        return res.status(500).json({ status: false, err });
      }
      return res.status(200).json({ status: true, response: data });
    });
  });
};
module.exports = {
  getOneUserPerId,
  registerUser,
};
