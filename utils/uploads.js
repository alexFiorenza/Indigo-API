const path = require('path');
const fs = require('fs');
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

module.exports = {
  resolveExtension,
  deleteFiles,
};
