const fs = require('fs');
const { request, response } = require('express');
const { handleError, handleResponse } = require('./manageResponse');
const uniqid = require('uniqid');
const mongoose = require('mongoose');
const resolveExtension = (image, id = null) => {
  if (image instanceof Array) {
    let imagesArray = [];
    const uid = uniqid();
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
          reason: 'Wrong extension',
        };
      }
    });
    return {
      check: true,
      response: imagesArray,
      uid,
    };
  } else {
    const fileName = image.name.replace(/\s/g, '');
    const splitedImage = fileName.split('.');
    const ext = splitedImage[splitedImage.length - 1];
    const uid = uniqid();
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
        response: imageName,
        uid,
      };
    } else {
      return {
        check: false,
        reason: 'Wrong extension',
      };
    }
  }
};
// TODO Check service to delete files
const deleteFiles = async (file, id, Model = mongoose.Model, imageId) => {
  if (file instanceof Array) {
    return handleError(
      500,
      req,
      res,
      "You can't delete more than 1 file per request"
    );
  } else {
    fs.unlinkSync(`uploads/${files}`);
    Model.findOneAndUpdate(
      { _id: id },
      { $pull: { images: { uid: imageId } } },
      (err, response) => {
        if (err) {
          return handleError(500, req, res);
        }
        return handleResponse(200, req, res, {
          message: `File (${file}) was succesfully deleted in store service and database`,
        });
      }
    );
  }
};
//TODO Add gcp service
//TODO Refactor image uploading services
/*Service to upload images*/
const uploadImages = (
  id,
  body,
  req = request,
  res = response,
  Model = mongoose.Model
) => {
  var image = req.files.image;
  if (body.deleteFiles) {
    deleteFiles(body.deleteFiles);
  }
  let imagesToUpload = [];
  const { response: imageName, uid } = resolveExtension(image, id);
  let obj = {
    uid,
  };
  if (imageName instanceof Array) {
    Object.assign(obj, { image: [] });
    imageName.forEach((i) => {
      obj.image.push(i);
    });
  } else {
    Object.assign(obj, {
      image: imageName,
    });
  }
  Model.findOneAndUpdate({ _id: id });
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
