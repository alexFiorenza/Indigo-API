const { handleError, handleResponse } = require('../utils/manageResponse');
const sendGrid = require('@sendgrid/mail');
sendGrid.setApiKey(process.env.email_api_key);
const { request, response } = require('express');
const moment = require('moment');
moment.locale('es');
const testEmail = (req = request, res = response) => {
  const msg = {
    to: 'alexxdfiorenza@gmail.com',
    from: process.env.email_sender_address,
    subject: 'Using send grid test',
    text: 'This is a test email for api ',
    html: '<strong>Test email</strong>',
  };
  sendGrid
    .send(msg)
    .then((res) => {
      if (res.Response.statusCode === 202) {
        return handleResponse(200, req, res, 'Email was sent properly');
      } else {
        return handleError(500, req, res);
      }
    })
    .catch((err) => {
      return handleError(500, req, res, err);
    });
};
const sendConfirmationOrder = (req, res) => {
  const order_data = req.body.order;
  if (!order_data) {
    return handleError(500, req, res, 'Order data was not provided');
  }
  const date = moment(order_data).format('l');
  let delivery;
  if (order_data.deliveryMethod === 'andreani') {
    delivery = `Envio a domicilio despacho desde ${order_data.branch_office.localidad}`;
  } else {
    delivery = order_data.deliveryMethod;
  }
  const msg = {
    personalizations: [
      {
        to: [
          {
            email: order_data.user.email,
            name: order_data.user.name,
          },
        ],
        dynamic_template_data: {
          order_tracking_id: order_data.trackingId,
          order_date: date,
          client_address_street: `${order_data.user.street} ${order_data.user.numberStreet}`,
          client_address_town: order_data.user.town,
          client_address_province: order_data.user.province,
          client_address_cp: order_data.user.cp,
          order_payment_method: order_data.paymentData.payment_method,
          order_payment_price: order_data.price,
          order_shipping_method: delivery,
          order_state: order_data.status,
        },
      },
    ],
    from: {
      email: process.env.email_sender_address,
      name: process.env.email_sender_name,
    },
    template_id: process.env.transaction_completed_id.toString(),
  };
  sendGrid
    .send(msg)
    .then((response) => {
      return handleResponse(200, req, res, 'Email was sent properly');
    })
    .catch((err) => {
      return handleError(500, req, res, err);
    });
};
const updateOrderStatus = (req = request, res = response) => {
  const order_data = req.body.order;
  if (!order_data) {
    return handleError(500, req, res, 'Order data was not provided');
  }
  if (order_data.deliveryMethod === 'andreani') {
    delivery = `Envio a domicilio despacho desde ${order_data.branch_office.localidad}`;
  } else {
    delivery = `Retira en sucursal ${order_data.branch_office.localidad}`;
  }
  const msg = {
    personalizations: [
      {
        to: [
          {
            email: order_data.user.email,
            name: order_data.user.name,
          },
        ],
        dynamic_template_data: {
          order_tracking_id: order_data.trackingId,
          order_state: order_data.status,
          order_shipping_method: delivery,
          order_delivery_cost: order_data.costToSend,
          order_delivery_branch_localidad: order_data.branch_office.localidad,
          order_delivery_products: order_data.trackingDeliveryData,
          order_payment_method: order_data.paymentData.payment_method,
          order_payment_price: order_data.price,
        },
      },
    ],
    from: {
      email: process.env.email_sender_address,
      name: process.env.email_sender_name,
    },
    template_id: process.env.update_order_status_andreani.toString(),
  };
  sendGrid
    .send(msg)
    .then((response) => {
      return handleResponse(200, req, res, 'Email was sent properly');
    })
    .catch((err) => {
      return handleError(500, req, res, err);
    });
};

module.exports = { testEmail, sendConfirmationOrder, updateOrderStatus };
