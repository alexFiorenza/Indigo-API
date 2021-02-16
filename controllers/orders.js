const Order = require('../models/orders');
const _ = require('underscore');
const { handleError, handleResponse } = require('../utils/manageResponse');
const mercadopago = require('mercadopago');
const { request } = require('express');
const moment = require('moment');
const PORT = process.env.PORT || 3000;

/*Set mp accessToken*/
mercadopago.configurations.setAccessToken(process.env.ACCESS_TOKEN_MP);

/*Process mercadopago payment*/
const processPayment = (req, res) => {
  const body = req.body;
  const emailUser = req.user.email;
  const payment_data = {
    transaction_amount: Number(body.price),
    token: body.orderInfo.token,
    installments: Number(body.installments),
    payment_method_id: body.paymentMethodId,
  };

  if (PORT === 3000) {
    Object.assign(payment_data, {
      payer: {
        email: 'testuser@gmail.com',
        identification: {
          type: body.orderInfo.docType,
          number: req.body.docNumber,
        },
      },
    });
  } else {
    Object.assign(payment_data, {
      payer: {
        email: emailUser,
        identification: {
          type: body.orderInfo.docType,
          number: req.body.docNumber,
        },
      },
    });
  }
  //MP user
  // {"id":682470188,"nickname":"TESTKR2J39CU","password":"qatest5363","site_status":"active","email":"test_user_17045136@testuser.com"}
  mercadopago.payment
    .save(payment_data)
    .then((response) => {
      const dataToSave = {
        price: Number(body.price),
        products: body.orderInfo.products,
        user: {
          ...req.user,
          docType: body.orderInfo.docType,
          docNumber: body.orderInfo.docNumber,
        },
        date: body.date,
        delayTime: body.orderInfo.delayTime,
        status: 'Pendiente',
        paid: true,
        branch_office: body.orderInfo.branch_office,
        deliveryMethod: body.orderInfo.delivery,
        paymentMethod: {
          payment_method: response.body.payment_method_id,
          payment_type: response.body.payment_type_id,
        },
      };
      if (body.orderInfo.costToSend) {
        Object.assign(dataToSave, { costToSend: body.orderInfo.costToSend });
      }
      Order.create(dataToSave, (err, orderCreated) => {
        if (err) {
          return handleError(500, req, res);
        }
        return handleResponse(response.status, req, res, {
          status: response.body.status,
          status_detail: response.body.status_detail,
          id: response.body.id,
          order: orderCreated,
        });
      });
    })
    .catch((err) => {
      return handleError(500, req, res, err);
    });
};

/*Update order status*/
const updateOrder = (req, res) => {
  const body = req.body;
  const id = req.params.id;
  const dataToUpdate = _.pick(body, ['status']);
  Order.findByIdAndUpdate(
    id,
    dataToUpdate,
    { new: true },
    (err, documentUpdated) => {
      if (err) {
        return handleError(500, req, res);
      }
      return handleResponse(200, req, res, { documentUpdated });
    }
  );
};

/*Get all orders and sort them*/
const getAllOrders = (req, res) => {
  const user = req.user;
  const query = req.query;
  if (user.role === 'admin') {
    if (query.filter === 'history') {
      const today = moment();
      const dateToEvaluate = moment().subtract(30, 'days');
      Order.find({ status: 'Completado' }, (err, ordersFound) => {
        let orders = [];
        ordersFound.forEach((order) => {
          if (order.createdAt) {
            const dateOrder = new Date(order.createdAt);
            const betweenDates = moment(dateOrder).isBetween(
              dateToEvaluate,
              today
            );
            if (betweenDates) {
              orders.push(order);
            }
          }
        });
        return handleResponse(200, req, res, orders);
      });
    } else {
      Order.find(
        { $nor: [{ status: 'rechazado' }, { status: 'completado' }] },
        (err, ordersFound) => {
          if (err) {
            return handleError(500, req, res);
          }
          return handleResponse(200, req, res, ordersFound);
        }
      );
    }
  } else {
    if (query.filter === 'history') {
      Order.find({ 'user._id': user._id }, (err, ordersFound) => {
        if (err) {
          return handleError(500, req, res);
        }
        return handleResponse(200, req, res, ordersFound);
      });
    } else {
      Order.find(
        {
          $and: [
            { 'user._id': user._id },
            { $nor: [{ status: 'rechazado' }, { status: 'completado' }] },
          ],
        },
        (err, orderFound) => {
          if (err) {
            return handleError(500, req, res);
          }
          return handleResponse(200, req, res, orderFound);
        }
      );
    }
  }
};

const getOrderId = (req, res) => {
  const id = req.params.id;

  Order.findById(id, (err, orderFound) => {
    if (err) {
      return handleError(500, req, res);
    }
    return handleResponse(200, req, res, orderFound);
  });
};
const getOrderPerUser = (req = request, res) => {
  const userId = req.params.id;
  Order.find({ 'user._id': userId }, (err, ordersFound) => {
    if (err) {
      return handleError(500, req, res);
    }
    return handleResponse(200, req, res, ordersFound);
  });
};

module.exports = {
  processPayment,
  getAllOrders,
  updateOrder,
  getOrderId,
  getOrderPerUser,
};
