const { request } = require('express');
const { handleError, handleResponse } = require('../utils/manageResponse');
const axios = require('axios');
const andreaniCredentials = (req = request, res) => {
  const user_password = `${process.env.user_andreani}:${process.env.password_andreani}`;
  const url = process.env.andreani_url;
  const base64 = Buffer.from(user_password).toString('base64');
  const opts = {
    headers: {
      Authorization: `Basic ${base64}`,
    },
  };
  if (url) {
    axios
      .get(`${url}/login`, opts)
      .then(function (response) {
        return handleResponse(200, req, res, {
          authToken: response.headers['x-authorization-token'],
          client_code: process.env.client_andreani,
          branch_office_shipping: process.env.branch_office_shipping,
          standard_shipping: process.env.standard_shipping,
          fast_shipping: process.env.fast_shipping,
        });
      })
      .catch((err) => {
        if (err) {
          return handleError(500, req, res);
        }
      });
  } else {
    return handleError(404, req, res, 'Url not provided');
  }
};

module.exports = {
  andreaniCredentials,
};
