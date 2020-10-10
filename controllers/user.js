const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/user');
const { handleError, handleResponse } = require('../utils/manageResponse');
const { createToken } = require('../utils/auth');
const manageResponse = require('../utils/manageResponse');
/*Get one user per id*/
const getOneUserPerId = (req, res) => {
  const { id } = req.params;
  User.findById(id, (err, userFound) => {
    if (err) {
      return handleError(500, req, res);
    } else if (userFound === undefined) {
      return handleError(404, req, res, 'Data not found');
    }
    return handleResponse(200, req, res, userFound);
  });
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
      return handleError(500, req, res);
    }
    if (userFound.length > 0) {
      return handleError(500, req, res, 'User already exists');
    }
    User.create(data, (err) => {
      if (err) {
        return handleError(500, req, res);
      }
      return handleResponse(200, req, res, data);
    });
  });
};
/*Login user*/
const loginUser = (req, res) => {
  const body = req.body;
  User.findOne({ email: body.email }, (err, userFound) => {
    if (!userFound) {
      return handleError(400, req, res, 'User does not exist');
    } else if (err) {
      return handleError(500, req, res);
    }
    bcrypt.compare(body.password, userFound.password, (err, same) => {
      if (!same) {
        return handleError(500, req, res, 'Wrong password');
      }
      const payload = _.pick(userFound, [
        'name',
        'location',
        'municipality',
        'street',
        'role',
        'email',
        'province',
        '_id',
      ]);
      createToken(payload)
        .then((data) => {
          const token = data;
          return handleResponse(200, req, res, { token, payload });
        })
        .catch((err) => {
          return handleError(500, req, res);
        });
    });
  });
};
//TODO
/* Update user*/
const updateUser = (req, res) => {};

//TODO
/*Delete user*/
const deleteUser = (req, res) => {
  const id = req.params.id;
  User.findByIdAndDelete(id, (err, userDeleted) => {
    if (err) {
      return handleError(500, req, res);
    }
    return handleResponse(200, req, res, 'User deleted correctly');
  });
};

module.exports = {
  getOneUserPerId,
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
};
