const { verifyAdmin, verifyToken } = require('../utils/auth');
const { handleError, handleResponse } = require('../utils/manageResponse');
const fs = require('fs');
const Product = require('../models/product.js');
const path = require('path');
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
/*Get all products and paginate them*/
const getAllProducts = (req, res) => {};
/*Create product*/
//TODO implement image uploading
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
  ]);
  Product.create(dataToUpdate, (err, dataCreated) => {
    if (err) {
      return handleError(500, req, res);
    }
    return handleResponse(200, req, res, dataCreated);
  });
};
/*Update product*/
//TODO implement image updating
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
  ]);
  Product.findByIdAndUpdate(
    id,
    dataToUpdate,
    { new: true, useFindAndModify: false },
    (err, dataUpdated) => {
      if (err) {
        return handleError(500, req, res);
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

const uploadImage = (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const image = req.files.image;
  const fileName = image.name.replace(/\s/g, '');
  const splitedImage = fileName.split('.');
  const ext = splitedImage[splitedImage.length - 1];
  if (ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'gif') {
    Product.findById(id, (err, productFound) => {
      if (err) {
        return handleError(500, req, res, 'Image could not be uploaded');
      }
      const imageName = `${splitedImage[0]}-${productFound._id}.${ext}`;
      if (body.deleteFile) {
        let newProductImages;
        if (body.deleteFile instanceof Array) {
          body.deleteFile.forEach((i) => {
            newProductImages = productFound.image.filter((p) => {
              return p !== i;
            });
            fs.unlinkSync(`uploads/${i}`);
          });
        } else {
          newProductImages = productFound.image.filter((p) => {
            return p !== body.deleteFile;
          });
          fs.unlinkSync(`uploads/${body.deleteFile}`);
        }
        const arrayToUpdate = {
          image: newProductImages,
        };
        Product.findByIdAndUpdate(
          id,
          arrayToUpdate,
          {
            useFindAndModify: false,
            new: true,
          },
          (err, productUpdated) => {
            if (err) {
              return handleError(500, req, res);
            }
            return handleResponse(200, req, res, {
              images: newProductImages,
              product: productUpdated,
            });
          }
        );
      }

      image.mv(`uploads/${imageName}`, (err) => {
        if (err) {
          return handleError(500, req, res);
        }
        productFound.image.push(imageName);
        const arrayToUpdate = {
          image: productFound.image,
        };
        Product.findByIdAndUpdate(
          id,
          arrayToUpdate,
          { useFindAndModify: false, new: true },
          (err, productUpdated) => {
            if (err) {
              return handleError(500, req, res);
            }
            return handleResponse(200, req, res, {
              imageUpload: imageName,
              product: productUpdated,
            });
          }
        );
      });
    });
  } else {
    return handleError(500, req, res);
  }
};

module.exports = {
  getProductPerId,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
