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
const createOrder = (req, res) => {
  const credentials = req.body.credentials;
  const origin = req.body.origin;
  const destination = req.body.destination;
  const sender = req.body.sender;
  const receiver = req.body.receiver;
  const packages = req.body.packages;
  const order = {
    contrato: credentials.client_code,
    origen: origin,
    destino: destination,
    remitente: sender,
    destinatario: receiver,
    bultos: packages,
  };

  //   {
  //     "contrato": "300006611",
  //     "origen": {
  //         "postal": {
  //             "codigoPostal": "3378",
  //             "calle": "Av Falsa",
  //             "numero": "380",
  //             "localidad": "Puerto Esperanza",
  //             "region": "",
  //             "pais": "Argentina",
  //             "componentesDeDireccion": [
  //                 {
  //                     "meta": "entreCalle",
  //                     "contenido": "Medina y Jualberto"
  //                 }
  //             ]
  //         }
  //     },
  //     "destino": {
  //         "postal": {
  //             "codigoPostal": "1292",
  //             "calle": "Macacha Guemes",
  //             "numero": "28",
  //             "localidad": "C.A.B.A.",
  //             "region": "AR-B",
  //             "pais": "Argentina",
  //             "componentesDeDireccion": [
  //                 {
  //                     "meta": "piso",
  //                     "contenido": "2"
  //                 },
  //                 {
  //                     "meta": "departamento",
  //                     "contenido": "B"
  //                 }
  //             ]
  //         }
  //     },
  //     "remitente": {
  //         "nombreCompleto": "Alberto Lopez",
  //         "email": "remitente@andreani.com",
  //         "documentoTipo": "DNI",
  //         "documentoNumero": "33111222",
  //         "telefonos": [
  //             {
  //                 "tipo": 1,
  //                 "numero": "113332244"
  //             }
  //         ]
  //     },
  //     "destinatario": [
  //         {
  //             "nombreCompleto": "Juana Gonzalez",
  //             "email": "destinatario@andreani.com",
  //             "documentoTipo": "DNI",
  //             "documentoNumero": "33999888",
  //             "telefonos": [
  //                 {
  //                     "tipo": 1,
  //                     "numero": "1112345678"
  //                 }
  //             ]
  //         },
  //         {
  //             "nombreCompleto": "Jose Gonzalez",
  //             "email": "alter@andreani.com",
  //             "documentoTipo": "DNI",
  //             "documentoNumero": "33922288",
  //             "telefonos": [
  //                 {
  //                     "tipo": 1,
  //                     "numero": "153111231"
  //                 }
  //             ]
  //         }
  //     ],
  //     "bultos": [
  //         {
  //             "kilos": 2,
  //             "largoCm": 10,
  //             "altoCm": 50,
  //             "anchoCm": 10,
  //             "volumenCm": 5000,
  //             "valorDeclaradoSinImpuestos": 1200,
  //             "valorDeclaradoConImpuestos": 1452,
  //             "referencias": [
  //                 {
  //                     "meta": "detalle",
  //                     "contenido": "Secador de pelo"
  //                 },
  //                 {
  //                     "meta": "idCliente",
  //                     "contenido": "10000"
  //                 }
  //             ]
  //         }
  //     ]
  // }
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
module.exports = {
  andreaniCredentials,
  shippingCost,
  createOrder,
};
