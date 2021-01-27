const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/user');
const { handleError, handleResponse } = require('../utils/manageResponse');
const { createToken } = require('../utils/auth');
const manageResponse = require('../utils/manageResponse');
const { request } = require('express');
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
  const password = body.password;
  const encryptedPassword = bcrypt.hashSync(password, saltRounds);
  Object.assign(body, { password: encryptedPassword });
  User.find({ email: body.email }, async (err, userFound) => {
    if (err) {
      return handleError(500, req, res);
    }
    if (userFound.length > 0) {
      return handleError(500, req, res, 'User already exists');
    }
    const userDb = new User(body);
    const value = await userDb.save();
    if (value) {
      return handleResponse(200, req, res, value);
    } else {
      return handleError(500, req, res);
    }
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
        'town',
        'street',
        'role',
        'email',
        'province',
        '_id',
        'cp',
        'phone',
        'date',
        'numberStreet',
        'instructions',
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
/*Push product to favorites array*/
const manageFavorites = (req, res) => {
  const product = _.pick(req.body, ['product']);
  const user = req.user;
  User.findByIdAndUpdate(
    user._id,
    { $push: { favorites: product } },
    {
      new: true,
      useFindAndModify: false,
    },
    (err, productUpdated) => {
      if (err) {
        return handleError(500, req, res);
      }
      return handleResponse(200, req, res, productUpdated);
    }
  );
};
/*Delete a favorite product*/
const deleteFavorite = (req = request, res) => {
  const productToDelete = _.pick(req.body, ['product']);
  const user = req.user;
  User.findByIdAndUpdate(
    user._id,
    {
      $pull: { favorites: { _id: productToDelete._id } },
    },
    {
      useFindAndModify: false,
    },
    (err, productFound) => {
      if (err) {
        return handleError(500, req, res);
      }
      return handleResponse(200, req, res, productFound);
    }
  );
};
/*Controller to get favorites*/
const getFavorites = (req = request, res) => {
  const user = req.user._id;
  User.findById(user)
    .select('favorites -_id')
    .exec((err, favoritesFound) => {
      if (err) {
        return handleError(500, req, res);
      }
      return handleResponse(200, req, res, favoritesFound);
    });
};
/* Update user*/
const updateUser = (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const dataToUpdate = _.pick(body, [
    'name',
    'town',
    'province',
    'street',
    'numberStreet',
    'instructions',
    'cp',
    'phone',
  ]);
  User.findByIdAndUpdate(
    id,
    dataToUpdate,
    { new: true },
    (err, userUpdated) => {
      if (err) {
        return handleError(500, req, res);
      }
      return manageResponse(200, req, res, userUpdated);
    }
  );
};

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
  manageFavorites,
  getFavorites,
  deleteFavorite,
};
