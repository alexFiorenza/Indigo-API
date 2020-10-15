const Order = require('../models/orders');
const _ = require('underscore');
const { handleError, handleResponse } = require('../utils/manageResponse');
const mercadopago = require('mercadopago');

/*Set mp accessToken*/
mercadopago.configurations.setAccessToken(process.env.ACCESS_TOKEN_MP);

/*Process mercadopago payment*/
const processPayment = (req, res) => {
  const body = req.body;
  const emailUser = req.user.email;
  const payment_data = {
    transaction_amount: Number(body.price),
    token: body.token,
    installments: Number(body.installments),
    payment_method_id: body.paymentMethodId,
    payer: {
      email: emailUser,
    },
  };
  mercadopago.payment
    .save(payment_data)
    .then((resp) => {
      const dataToSave = {
        price: Number(body.price),
        products: body.products,
        user: req.user,
        date: body.date,
        delayTime: body.delayTime,
        status: 'activo',
        paid: true,
        deliveryMethod: body.delivery,
        paymentMethod: {
          payment_method: resp.body.payment_method_id,
          payment_type: resp.body.payment_type_id,
        },
      };
      Order.create(dataToSave, (err, orderCreated) => {
        if (err) {
          return handleError(500, req, res);
        }
        return handleResponse(resp.status, req, res, {
          status: resp.body.status,
          status_detail: resp.body.status_detail,
          id: resp.body.id,
          order: orderCreated,
        });
      });
    })
    .catch((err) => {
      return handleError(resp.status, req, res);
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
    Order.find(
      { $nor: [{ status: 'rechazado' }, { status: 'completado' }] },
      (err, ordersFound) => {
        if (err) {
          return handleError(500, req, res);
        }
        return handleResponse(200, req, res, ordersFound);
      }
    );
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

module.exports = {
  processPayment,
  getAllOrders,
  updateOrder,
  getOrderId,
};
