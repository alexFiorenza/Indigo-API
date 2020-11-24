const { handleError, handleResponse } = require('../utils/manageResponse');
const Product = require('../models/product.js');
const { uploadImages } = require('../utils/uploads');
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
  const dataToCreate = req.body;
  Product.create(dataToCreate, (err, dataCreated) => {
    if (err) {
      return handleError(500, req, res);
    }
    if (req.files !== undefined) {
      uploadImages(dataCreated._id, body, req, res, Product);
      return handleResponse(200, req, res, 'Object succesfully created');
    }
    return handleResponse(200, req, res, dataCreated);
  });
};
/*Update product*/
const updateProduct = (req, res) => {
  const body = req.body;
  const id = req.params.id;
  Product.findByIdAndUpdate(
    id,
    body,
    { new: true, useFindAndModify: false },
    (err, dataUpdated) => {
      if (err) {
        return handleError(500, req, res);
      }
      if (req.files !== null || body.deleteFile !== null) {
        uploadImages(dataUpdated._id, body, req, res, Product);
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
