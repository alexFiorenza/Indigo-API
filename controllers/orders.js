const Order = require('../models/orders');
const { handleError, handleResponse } = require('../utils/manageResponse');
const { verifyAdmin, verifyToken } = require('../utils/auth');
const mercadopago = require('mercadopago');

mercadopago.configurations.setAccessToken(process.env.ACCESS_TOKEN_MP);
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
        user: req.user._id,
        date: body.date,
        delayTime: body.delayTime,
        status: 'ACTIVE',
        paid: true,
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

module.exports = {
  processPayment,
};
