const { request } = require('express');
const Category = require('../models/categories');
const Product = require('../models/product');
const { handleError, handleResponse } = require('../utils/manageResponse');
const getAllCategories = (req, res) => {
  Category.find({}, (err, categoriesFound) => {
    if (err) {
      handleError(500, req, res);
    }
    return handleResponse(200, req, res, categoriesFound);
  });
};
const updateSubCategories = (req = request, res) => {
  const data = req.body;
  console.log(data);
  const category = req.params.id;
  Category.findByIdAndUpdate(
    category,
    {
      $push: {
        subcategories: data,
      },
    },
    {
      new: true,
    },
    (err, productUpdated) => {
      if (err) {
        return handleError(500, req, res);
      }
      return handleResponse(200, req, res, productUpdated);
    }
  );
};
const getCategoryById = (req = request, res) => {
  const { id } = req.params;
  Category.findById(id, (err, categoryFound) => {
    if (err) {
      return handleError(500, req, res);
    }
    return handleResponse(200, req, res, categoryFound);
  });
};
const createCategory = (req = request, res) => {
  const { body } = req;
  Category.create(body, (err, categoryCreated) => {
    if (err) {
      return handleError(500, req, res);
    }
    return handleResponse(200, req, res, categoryCreated);
  });
};
const addCategoryToProduct = (req = request, res) => {
  const id = req.params.id;
  const category = req.body;
  Product.update(
    { _id: id },
    { $set: category },
    { upsert: true, new: true },
    (err, productUpdated) => {
      if (err) {
        return handleError(500, req, res);
      }
      return handleResponse(200, req, res, productUpdated);
    }
  );
};

const deleteCategoryFromProduct = (req, res) => {
  const id = req.params.id;
  const category = req.body;
  Product.findByIdAndUpdate(
    id,
    {
      $pull: { categories: { _id: category._id } },
    },
    { useFindAndModify: true, new: true },
    (err, productUpdated) => {
      if (err) {
        return handleError(500, req, res);
      }
      return handleResponse(200, req, res, productUpdated);
    }
  );
};
const deleteSubCategory = (req = request, res) => {
  const category = req.params.id;
  const subCategory = req.body;
  Category.findByIdAndUpdate(
    category,
    {
      $pull: { subcategories: { name: subCategory.name } },
    },
    { new: true },
    (err, categoryUpdated) => {
      if (err) {
        return handleError(500, req, res);
      }
      return handleResponse(200, req, res, categoryUpdated);
    }
  );
};
const deleteCategory = (req = request, res) => {
  const id = req.params.id;
  Category.findByIdAndDelete(id, (err, productDeleted) => {
    if (err) {
      return handleError(500, req, res);
    }
    return handleResponse(200, req, res, productDeleted);
  });
};
module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  addCategoryToProduct,
  deleteCategoryFromProduct,
  updateSubCategories,
  deleteSubCategory,
  deleteCategory,
};
