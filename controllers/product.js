const { verifyAdmin, verifyToken } = require('../utils/auth');
const { handleError, handleResponse } = require('../utils/manageResponse');
const Product = require('../models/product.js');
const _ = require('underscore');
/*Get product depending on id*/
const getProductPerId = (req, res) => {
  const id = req.params.id;
  Product.findById(id, (err, productFound) => {
    if (err) {
      return handleError(500, req, res);
    }
    return handleResponse(200, req, res, productFound);
  });
};
/*Create product*/
//TODO implement image uploading
const createProduct = (req, res) => {
  const body = req.body;
  const dataToUpdate = _.pick(body, [
    'name',
    'description',
    'type',
    'sizes',
    'price',
    'color',
  ]);
  Product.create(dataToUpdate, (err, dataCreated) => {
    if (err) {
      return handleError(500, req, res);
    }
    return handleResponse(200, req, res, dataCreated);
  });
};

module.exports = {
  getProductPerId,
  createProduct,
};
