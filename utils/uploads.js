const fs = require('fs');
const { request, response } = require('express');
const { handleError, handleResponse } = require('./manageResponse');
const uniqid = require('uniqid');
const mongoose = require('mongoose');
const resolveExtension = (image, id = null) => {
  if (image instanceof Array) {
    let imagesArray = [];
    let uid;
    image.forEach((i) => {
      const filename = i.name.replace(/\s/g, '');
      const splitedImage = filename.split('.');
      const ext = splitedImage[splitedImage.length - 1];
      if (ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'gif') {
        uid = uniqid();
        const imageName = `${splitedImage[0]}-${id}.${ext}`;
        i.mv(`uploads/${imageName}`, (err) => {
          if (err) {
            return {
              err,
              message: 'Unexpected error',
            };
          }
        });
        const tmp = {
          uid,
          image: imageName,
        };
        imagesArray.push(tmp);
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
const deleteFiles = async (
  file,
  id,
  Model = mongoose.Model,
  imageId,
  req,
  res
) => {
  console.log(file);
  if (file instanceof Array) {
    return handleError(
      500,
      req,
      res,
      "You can't delete more than 1 file per request"
    );
  } else {
    fs.unlinkSync(`uploads/${file}`);
    Model.findByIdAndUpdate(
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
  if (body.deleteFile) {
    let uidImg;
    Model.findOne(
      { 'images.image': body.deleteFile },
      (err, { images: imagesArray }) => {
        if (err) {
          return handleError(500, req, res);
        }
        imagesArray.forEach((i) => {
          if (i.image === body.deleteFile) {
            uidImg = i.uid;
          }
        });
        deleteFiles(body.deleteFile, id, Model, uidImg, req, res);
      }
    );
  } else if (req.files !== null) {
    var image = req.files.image;
    const { response: imageName, uid } = resolveExtension(image, id);
    let obj;
    if (imageName instanceof Array) {
      obj = imageName;
    } else {
      obj = {
        uid,
        image: imageName,
      };
    }
    Model.findByIdAndUpdate(
      { _id: id },
      { $push: { images: obj } },
      {
        useFindAndModify: false,
        new: true,
        multi: true,
      },
      (err, productUpdated) => {
        if (err) {
          return handleError(500, req, res);
        }
        return handleResponse(200, req, res, productUpdated);
      }
    );
  }
};
module.exports = {
  resolveExtension,
  deleteFiles,
  uploadImages,
};
