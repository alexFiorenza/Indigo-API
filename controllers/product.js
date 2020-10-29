const { verifyAdmin, verifyToken } = require('../utils/auth');
const { handleError, handleResponse } = require('../utils/manageResponse');
const fs = require('fs');
const Product = require('../models/product.js');
const path = require('path');
const _ = require('underscore');
const { uploadImageProducts } = require('../utils/uploads');
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
/*Get all products and paginate them*/
const getAllProducts = (req, res) => {
  const opts = {
    page: req.params.page,
  };
  if (req.query.limit) {
    Object.assign(opts, { limit: req.query.limit });
  } else {
    Object.assign(opts, { limit: 10 });
  }
  Product.paginate({}, opts, (err, result) => {
    if (err) {
      return handleError(500, req, res);
    }
    return handleResponse(200, req, res, {
      totalPages: result.totalPages,
      products: result.docs,
    });
  });
};
/*Create product*/
const createProduct = (req, res) => {
  const body = req.body;
  const dataToUpdate = _.pick(body, [
    'name',
    'description',
    'categories',
    'sizes',
    'price',
    'color',
    'weight',
    'top',
    'sale',
    'homeView',
    'stock',
  ]);
  Product.create(dataToUpdate, (err, dataCreated) => {
    if (err) {
      return handleError(500, req, res);
    }
    if (req.files !== undefined) {
      uploadImageProducts(dataCreated._id, body, req, res);
      return handleResponse(200, req, res, 'Object succesfully created');
    }
    return handleResponse(200, req, res, dataCreated);
  });
};
/*Update product*/
const updateProduct = (req, res) => {
  const body = req.body;
  const id = req.params.id;
  const dataToUpdate = _.pick(body, [
    'name',
    'description',
    'categories',
    'sizes',
    'price',
    'color',
    'weight',
    'top',
    'sale',
    'homeView',
    'stock',
  ]);
  Product.findByIdAndUpdate(
    id,
    dataToUpdate,
    { new: true, useFindAndModify: false },
    (err, dataUpdated) => {
      if (err) {
        return handleError(500, req, res);
      }
      if (req.files !== null || body.deleteFile !== null) {
        uploadImageProducts(dataUpdated._id, body, req, res);
        return handleResponse(200, req, res, 'data was succesfully updated');
      }
      return handleResponse(200, req, res, dataUpdated);
    }
  );
};
/*Delete a product*/
const deleteProduct = (req, res) => {
  const id = req.params.id;
  Product.findByIdAndDelete(id, (err, documentDeleted) => {
    if (err) {
      return handleError(500, req, res);
    }
    return handleResponse(200, req, res, {
      message: 'Product deleted correctly',
      product: documentDeleted,
    });
  });
};

module.exports = {
  getProductPerId,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
};
