const fs = require('fs');
const { request, response } = require('express');
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
const deleteFiles = (file, id, Model = mongoose.Model, imageId) => {
  if (file instanceof Array) {
    return {
      status: 500,
      message: "You can't delete more than 1 file per request",
    };
  } else {
    return new Promise((resolve, reject) => {
      fs.unlinkSync(`uploads/${file}`);
      Model.findByIdAndUpdate(
        { _id: id },
        { $pull: { images: { uid: imageId } } },
        {
          useFindAndModify: false,
          new: true,
        }
      )
        .then((response) => {
          resolve({
            status: 200,
            message: `File (${file}) was succesfully deleted in store service and database`,
            response,
          });
        })
        .catch((err) => {
          reject({
            status: 500,
            message: `Error while trying to find: ${file}`,
            err,
          });
        });
    });
  }
};
//TODO Add gcp service
/*Service to upload | delete  images*/
const manageImages = async (
  id,
  body,
  req = request,
  res = response,
  Model = mongoose.Model
) => {
  if (body.deleteFile) {
    let uidImg;
    try {
      let deletedFiles;
      const { images: imagesArray } = await Model.findOne({
        'images.image': body.deleteFile,
      });
      imagesArray.forEach((i) => {
        if (i.image === body.deleteFile) {
          uidImg = i.uid;
        }
      });
      deleteFiles(body.deleteFile, id, Model, uidImg)
        .then((resp) => {
          deletedFiles = resp;
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      return {
        status: 500,
        message: 'Unexpected error',
        error,
      };
    }
  }
  if (req.files !== null) {
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
    try {
      const productUpdated = await Model.findByIdAndUpdate(
        { _id: id },
        { $push: { images: obj } },
        {
          useFindAndModify: false,
          new: true,
          multi: true,
        }
      );
      return {
        status: 200,
        response: productUpdated,
      };
    } catch (error) {
      return {
        status: 500,
        message: 'Unexpected error',
        error,
      };
    }
  }
  if (!body.deleteFile && !req.files) {
    return {
      status: 400,
      message: 'Files to upload or files to delete were not supplied',
    };
  }
};
module.exports = {
  resolveExtension,
  deleteFiles,
  manageImages,
};
