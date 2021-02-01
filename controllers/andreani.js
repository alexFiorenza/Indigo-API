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
const shippingCost = (req = request, res) => {
  const credentials = req.body.credentials;
  const shippingInfo = req.body.shippingInfo;
  const url = process.env.andreani_url;
  axios
    .get(
      `${url}/v1/tarifas?cpDestino=${shippingInfo.cp}&contrato=${credentials.standard_shipping}&cliente=${credentials.client_code}&sucursalOrigen=${shippingInfo.shipping_office}&bultos[0][valorDeclarado]=${shippingInfo.packages[0].price}&bultos[0][volumen]=${shippingInfo.packages[0].packageWeight.volume}&bultos[0][kilos]=${shippingInfo.packages[0].packageWeight.weight}`
    )
    .then(function (value) {
      return handleResponse(200, req, res, value.data);
    })
    .catch(function (err) {
      if (err) {
        return handleError(500, req, res);
      }
    });
  //Parameters | optimize
  // ?cpDestino=1400&contrato=300006611&cliente=CL0003750&sucursalOrigen=BAR&bultos[0][valorDeclarado]=1200&bultos[0][volumen]=200&bultos[0][kilos]=1.3
};
//TODO Execute andreani cost to send price
const executeQuery = (credentials, shippingInfo) => {};
module.exports = {
  andreaniCredentials,
  shippingCost,
};
