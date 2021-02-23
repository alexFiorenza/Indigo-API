const { request, response } = require('express');
const { handleError, handleResponse } = require('../utils/manageResponse');
const axios = require('axios').default;
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
  var totalVolume = 0;
  var totalPrice = 0;
  var totalWeight = 0;
  shippingInfo.packages.forEach((package) => {
    totalVolume += package.packageWeight.volume;
    totalPrice += package.price;
    totalWeight += package.packageWeight.weight;
  });
  executeQuery(
    `/v1/tarifas?cpDestino=${shippingInfo.cp}&contrato=${credentials.standard_shipping}&cliente=${credentials.client_code}&bultos[0][valorDeclarado]=${totalPrice}&bultos[0][volumen]=${totalVolume}&bultos[0][kilos]=${totalWeight}`,
    req,
    res
  );
};
const createOrder = (req = request, res) => {
  const credentials = req.body.credentials;
  const origin = req.body.origin;
  const destination = req.body.destination;
  const sender = req.body.sender;
  const receiver = req.body.receiver;
  const packages = req.body.packages;
  const url = process.env.andreani_url;
  setAuthToken(credentials).then((headers) => {
    axios
      .post(
        `${url}/v2/ordenes-de-envio`,
        {
          contrato: credentials.standard_shipping,
          origen: origin,
          destino: destination,
          destinatario: receiver,
          remitente: {
            nombreCompleto: process.env.owner_complete_name,
            email: process.env.owner_email,
            documentoTipo: process.env.owner_docType,
            documentoNumero: process.env.owner_docNumber,
          },
          bultos: packages,
        },
        { headers }
      )
      .then(function (value) {
        return handleResponse(200, req, res, value.data);
      })
      .catch(function (err) {
        if (err) {
          return handleError(500, req, res);
        }
      });
  });
};
function executeQuery(query, req, res) {
  const url = process.env.andreani_url;
  //**cpDestino=1400&contrato=300006611&cliente=CL0003750&sucursalOrigen=BAR&bultos[0][valorDeclarado]=1200&bultos[0][volumen]=200&bultos[0][kilos]=1.3
  axios
    .get(`${url}${query}`)
    .then(function (value) {
      return handleResponse(200, req, res, value.data);
    })
    .catch(function (err) {
      if (err) {
        return handleError(500, req, res);
      }
    });
}
const getStateOrder = async (req = request, res = response) => {
  const id = req.params.id;
  try {
    const header = await setAuthToken();
    const response = await axios.get(
      `${process.env.andreani_url}/v2/ordenes-de-envio/${id}`,
      {
        headers: header,
      }
    );
    if (response.data) {
      return handleResponse(200, req, res, response.data);
    }
  } catch (error) {
    return handleError(500, req, res, error.message);
  }
};
const setAuthToken = (data) => {
  return new Promise((resolve, reject) => {
    const user_password = `${process.env.user_andreani}:${process.env.password_andreani}`;
    const url = process.env.andreani_url;
    const base64 = Buffer.from(user_password).toString('base64');
    const opts = {
      headers: {
        Authorization: `Basic ${base64}`,
      },
    };
    axios
      .get(`${url}/login`, opts)
      .then(function (response) {
        if (response.headers['x-authorization-token']) {
          const headers = {
            'x-authorization-token': response.headers['x-authorization-token'],
          };
          resolve(headers);
        } else {
          reject('Credentials were not provided');
        }
      })
      .catch((err) => {
        if (err) {
          reject('Unexpected error');
        }
      });
  });
};
module.exports = {
  andreaniCredentials,
  shippingCost,
  createOrder,
  getStateOrder,
};
