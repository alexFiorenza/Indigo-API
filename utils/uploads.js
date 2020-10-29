const path = require('path');
const fs = require('fs');
const { handleResponse } = require('./manageResponse');
const Product = require('../models/product');
const Slide = require('../models/slides');
const resolveExtension = (image, id = null) => {
  if (image instanceof Array) {
    let imagesArray = [];
    image.forEach((i) => {
      const filename = i.name.replace(/\s/g, '');
      const splitedImage = filename.split('.');
      const ext = splitedImage[splitedImage.length - 1];
      if (ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'gif') {
        const imageName = `${splitedImage[0]}-${id}.${ext}`;
        i.mv(`uploads/${imageName}`, (err) => {
          if (err) {
            return {
              err,
              message: 'Unexpected error',
            };
          }
        });
        imagesArray.push(imageName);
      } else {
        return {
          check: false,
        };
      }
    });
    return {
      check: true,
      imagesArray,
    };
  } else {
    const fileName = image.name.replace(/\s/g, '');
    const splitedImage = fileName.split('.');
    const ext = splitedImage[splitedImage.length - 1];
    if (ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'gif') {
      const imageName = `${splitedImage[0]}-${id}.${ext}`;
      image.mv(`uploads/${imageName}`, (err) => {
        if (err) {
          return {
            err,
            message: 'Unexpected error',
          };
        }
      });
      return {
        check: true,
        imageName,
      };
    } else {
      return {
        check: false,
      };
    }
  }
};
const deleteFiles = (files, product) => {
  let newProductImages = [];
  if (files instanceof Array) {
    files.forEach((i) => {
      newProductImages = product.image.filter((p) => {
        return p !== i;
      });
      fs.unlinkSync(`uploads/${i}`);
    });
  } else {
    newProductImages = product.image.filter((p) => {
      return p !== files;
    });
    fs.unlinkSync(`uploads/${files}`);
  }
  return {
    status: true,
    arrayImages: newProductImages,
  };
};
//TODO Add gcp service
//TODO Refactor image uploading services
/*Service to upload images*/
const uploadImageProducts = (id, body, req, res) => {
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
          return {
            remainingImages: arrayToUpdate,
            deletedFiles: body.deleteFile,
            product: productUpdated,
          };
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
            return {
              images: imagesToUpload,
              product: productUpdated,
            };
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
              return {
                imageUpload: extResolve.imageName,
                product: productUpdated,
              };
            }
          );
        });
      }
    }
  });
};

const uploadSingleImageSlide = (id, req, res) => {
  Slide.findById(id, (err, slideReceived) => {});
};

module.exports = {
  resolveExtension,
  deleteFiles,
  uploadImageProducts,
  uploadSingleImageSlide,
};
