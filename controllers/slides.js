const Slide = require('../models/slides');
const { handleError, handleResponse } = require('../utils/manageResponse');
const { verifyAdmin, verifyToken } = require('../utils/auth');
const { request, response } = require('express');
const _ = require('underscore');
const slides = require('../models/slides');
const { uploadImage } = require('../utils/uploads');
const getSliderPerId = (req = request, res) => {
  const id = req.params.id;
  Slide.findById(id, (err, slideReceived) => {
    if (err) {
      return handleError(500, req, res);
    }
    return handleResponse(200, req, res, slideReceived);
  });
};
const getAllSlides = async (req, res) => {
  try {
    const slides = await Slide.find({});
    return handleResponse(200, req, res, slides);
  } catch (error) {
    return handleError(500, req, res);
  }
};
const createSlide = (req = request, res = response) => {
  const { body } = req;
  const dataPicked = _.pick(body, [
    'title',
    'description',
    'button',
    'color',
    'btnDirection',
    'wordsColor',
  ]);
  if (req.files === undefined) {
    return handleError(400, req, res, 'Missing image files to upload');
  } else {
    slides.create(dataPicked, (err, slideCreated) => {
      if (err) {
        return handleError(500, req, res);
      }
      //TODO implement image uploading sliders
      return handleResponse(200, req, res, slideCreated);
    });
  }
};
const updateSlide = (req, res) => {
  const { body } = req;
  const { id } = req.params;
  const dataPicked = _.pick(body, [
    'title',
    'description',
    'button',
    'color',
    'btnDirection',
    'wordsColor',
  ]);
  Slide.findByIdAndUpdate(
    id,
    dataPicked,
    { new: true, useFindAndModify: false },
    (err, slideUpdated) => {
      if (err) {
        return handleError(500, req, res);
      }
      if (req.files !== undefined) {
        uploadImage(slideUpdated._id, body, req, res);
      }
      //TODO implement image updating sliders
      return handleResponse(200, req, res, slideUpdated);
    }
  );
};
const deleteSlide = (req = request, res) => {
  const id = req.params.id;
  Slide.findByIdAndDelete(id, (err, slideReceived) => {
    if (err) {
      return handleError(500, req, res);
    }
    return handleResponse(200, req, res, slideReceived);
  });
};

module.exports = {
  getSliderPerId,
  getAllSlides,
  createSlide,
  updateSlide,
  deleteSlide,
};
