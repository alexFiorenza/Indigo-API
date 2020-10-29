const fs = require('fs');
const { request, response } = require('express');
const { handleError, handleResponse } = require('./manageResponse');
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
const uploadImages = (id, body, req = request, res = response, Model) => {
  var image;
  if (req.files !== null) {
    image = req.files.image;
  }

  Model.findById(id, (err, productFound) => {
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
      Model.findByIdAndUpdate(
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
        Model.findByIdAndUpdate(
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
        productFound.image.push(extResolve.imageName);
        const arrayToUpdate = {
          image: productFound.image,
        };
        Model.findByIdAndUpdate(
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
      }
    }
  });
};
const uploadSingleImg = (id, req = request, res = response, Model) => {
  var image;
  if (req.files !== null) {
    image = req.files.image;
  } else {
    return handleError(400, req, res, 'Image not uploaded');
  }
  Model.findOne({ _id: id }, async (err, slideFound) => {
    if (err) {
      return handleError(500, req, res);
    }
    if (slideFound.image !== null) {
      fs.unlinkSync(`uploads/${slideFound.image}`);
    }
    const extResolved = await resolveExtension(image, id);
    if (!extResolved.check) {
      return handleError(500, req, res);
    }

    Model.findByIdAndUpdate(
      id,
      { image: extResolved.imageName },
      { new: true },
      (err, collectionUploaded) => {
        if (err) {
          return handleError(500, req, res);
        }
        return collectionUploaded;
      }
    );
  });
};

module.exports = {
  resolveExtension,
  deleteFiles,
  uploadImages,
  uploadSingleImg,
};
