const { handleError, handleResponse } = require('../utils/manageResponse');
const Product = require('../models/product.js');
const { manageImages } = require('../utils/uploads');
const fs = require('fs');
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
      manageImages(dataCreated._id, body, req, res, Product);
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
    async (err, dataUpdated) => {
      if (err) {
        return handleError(500, req, res);
      }
      if (req.files !== null || body.deleteFile !== null) {
        try {
          const images = await manageImages(
            dataUpdated._id,
            body,
            req,
            res,
            Product
          );
          if (images.status === 200) {
            return handleResponse(200, req, res, {
              message: 'Data succesfully updated',
              response: images.response,
            });
          }
        } catch (error) {
          return handleError(500, req, res, error);
        }
      }
      return handleResponse(200, req, res, dataUpdated);
    }
  );
};
/*Delete a product*/
const deleteProduct = (req, res) => {
  const id = req.params.id;
  Product.findById(id, (err, productFound) => {
    if (err | (productFound.length < 0)) {
      return handleError(500, req, res);
    }
    if (productFound.images.length > 0) {
      productFound.images.forEach((i) => {
        fs.unlinkSync(`uploads/${i.image}`);
      });
    }
    Product.findByIdAndDelete(id, (err, documentDeleted) => {
      if (err) {
        return handleError(500, req, res);
      }
      return handleResponse(200, req, res, {
        message: 'Product deleted correctly',
        product: documentDeleted,
      });
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
