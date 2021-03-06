const Slide = require('../models/slides');
const { handleError, handleResponse } = require('../utils/manageResponse');
const { request, response } = require('express');
const _ = require('underscore');
const fs = require('fs');
const { manageImages } = require('../utils/uploads');
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
    'wordsColor',
  ]);
  Object.assign(dataPicked, { btnDirection: JSON.parse(body.btnDirection) });
  Slide.create(dataPicked, async (err, slideCreated) => {
    if (err) {
      return handleError(500, req, res);
    }
    if (req.files !== null) {
      try {
        const img = await manageImages(slideCreated._id, body, req, res, Slide);
        return handleResponse(200, req, res, {
          message: 'Slide succesfully created',
          response: img,
        });
      } catch (error) {
        return handleError(500, req, res, error);
      }
    }
    return handleResponse(200, req, res, slideCreated);
  });
};
const updateSlide = (req, res) => {
  const { body } = req;
  const { id } = req.params;
  const dataPicked = _.pick(body, [
    'title',
    'description',
    'button',
    'color',
    'wordsColor',
  ]);
  if (body.btnDirection) {
    Object.assign(dataPicked, { btnDirection: JSON.parse(body.btnDirection) });
  }
  Slide.findByIdAndUpdate(
    id,
    dataPicked,
    { new: true, useFindAndModify: false },
    async (err, slideUpdated) => {
      if (err) {
        return handleError(500, req, res);
      }
      if (req.files !== null) {
        try {
          const slideImg = await manageImages(
            slideUpdated._id,
            body,
            req,
            res,
            Slide
          );
          return handleResponse(200, req, res, {
            message: 'Slide was succesfully updated',
            response: slideImg,
          });
        } catch (error) {
          return handleError(500, req, res, error);
        }
      }
      return handleResponse(200, req, res, slideUpdated);
    }
  );
};
const deleteSlide = (req = request, res) => {
  const id = req.params.id;
  Slide.findById(id, (err, slideFound) => {
    if (err) {
      return handleError(500, req, res);
    }
    if (slideFound.image !== null) {
      fs.unlinkSync(`uploads/${slideFound.images[0].image}`);
    }
    Slide.findByIdAndDelete(id, (err, slideReceived) => {
      if (err) {
        return handleError(500, req, res);
      }
      return handleResponse(200, req, res, slideReceived);
    });
  });
};

module.exports = {
  getSliderPerId,
  getAllSlides,
  createSlide,
  updateSlide,
  deleteSlide,
};
