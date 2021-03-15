const { handleError, handleResponse } = require('../utils/manageResponse');
const sendGrid = require('@sendgrid/mail');
sendGrid.setApiKey(process.env.EMAIL_API_KEY);
const { request, response } = require('express');
const moment = require('moment');
moment.locale('es');
const testEmail = (req = request, res = response) => {
  const msg = {
    to: 'alexxdfiorenza@gmail.com',
    from: process.env.EMAIL_SENDER_ADDRESS,
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
      email: process.env.EMAIL_SENDER_ADDRESS,
      name: process.env.EMAIL_SENDER_NAME,
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
  let delivery;
  let hasToDeliverAddress;
  if (order_data.deliveryMethod === 'andreani') {
    delivery = `Envio a domicilio despacho desde ${order_data.branch_office.localidad}`;
    hasToDeliverAddress = true;
  } else {
    delivery = `Retira en sucursal ${order_data.branch_office.localidad}`;
    hasToDeliverAddress = false;
  }
  const msg = {
    to: {
      email: order_data.user.email,
      name: order_data.user.name,
    },
    from: {
      email: process.env.EMAIL_SENDER_ADDRESS,
      name: process.env.EMAIL_SENDER_NAME,
    },
    template_id: process.env.UPDATE_ORDER_STATUS.toString(),
    dynamic_template_data: {
      order_tracking_id: order_data.trackingId,
      order_status: order_data.status,
      order_shipping_method: delivery,
      order_shipping_bool: hasToDeliverAddress,
      order_delivery_cost: order_data.costToSend,
      order_delivery_branch_localidad: order_data.branch_office.localidad,
      order_delivery_branch_street: order_data.branch_office.calle,
      order_delivery_products: order_data.trackingDeliveryData,
      order_payment_method: order_data.paymentData.payment_method,
      order_payment_price: order_data.price,
      order_user_name: order_data.user.name,
      order_user_dni: order_data.user.docNumber,
    },
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

module.exports = {
  testEmail,
  sendConfirmationOrder,
  updateOrderStatus,
};
