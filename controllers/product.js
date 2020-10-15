const { verifyAdmin, verifyToken } = require('../utils/auth');
const { handleError, handleResponse } = require('../utils/manageResponse');
const fs = require('fs');
const Product = require('../models/product.js');
const path = require('path');
const _ = require('underscore');
const { resolveExtension, deleteFiles } = require('../utils/uploads');
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
//TODO Refactor service for upload Image,simplify it and add gcp service
const uploadImage = (req, res) => {
  const id = req.params.id;
  const body = req.body;
  var image;
  if (req.files !== null) {
    image = req.files.image;
  }
  Product.findById(id, (err, productFound) => {
    if (err) {
      return handleError(500, req, res, 'Image could not be uploaded');
    }
    if (body.deleteFile) {
      let arrayToUpdate = deleteFiles(body.deleteFile, productFound)
        .arrayImages;
      if (image) {
        const extResolve = resolveExtension(image, id);
        if (image instanceof Array) {
          extResolve.imagesArray.forEach((i) => {
            arrayToUpdate.push(i);
          });
        } else {
          arrayToUpdate.push(extResolve.imageName);
        }
      }
      Product.findByIdAndUpdate(
        id,
        { image: arrayToUpdate },
        {
          useFindAndModify: false,
          new: true,
        },
        (err, productUpdated) => {
          if (err) {
            return handleError(500, req, res);
          }
          return handleResponse(200, req, res, {
            remainingImages: arrayToUpdate,
            deletedFiles: body.deleteFile,
            product: productUpdated,
          });
        }
      );
    } else {
      if (image instanceof Array) {
        let imagesToUpload = [];
        const extResolve = resolveExtension(image, id);
        imagesToUpload.push(extResolve.imagesArray);
        if (!extResolve.check) {
          return handleError(500, req, res);
        }
        Product.findByIdAndUpdate(
          id,
          { image: extResolve.imagesArray },
          { useFindAndModify: false, new: true },
          (err, productUpdated) => {
            if (err) {
              return handleError(500, req, res);
            }
            return handleResponse(200, req, res, {
              images: imagesToUpload,
              product: productUpdated,
            });
          }
        );
      } else {
        const extResolve = resolveExtension(image, id);
        if (!extResolve.check) {
          return handleError(500, req, res);
        }
        image.mv(`uploads/${extResolve.imageName}`, (err) => {
          if (err) {
            return handleError(500, req, res);
          }
          productFound.image.push(extResolve.imageName);
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
      }
    }
  });
};

module.exports = {
  getProductPerId,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
