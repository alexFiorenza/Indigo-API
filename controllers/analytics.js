const { request } = require('express');
const { handleError, handleResponse } = require('../utils/manageResponse');
const User = require('../models/user');
const Order = require('../models/orders');
const moment = require('moment');
const getGeneralDataView = (req = request, res) => {
  const dateCriteria = req.params.date;
  const today = moment();
  const dateToEvaluate = moment().subtract(dateCriteria, 'days');
  var users = [];
  var orders = [];
  var money = 0;
  User.find((err, usersFound) => {
    if (err) {
      return handleError(500, req, res);
    }
    usersFound.forEach((user) => {
      if (user.createdAt) {
        const dateUser = new Date(user.createdAt);
        const betweenDates = moment(dateUser).isBetween(dateToEvaluate, today);
        if (betweenDates) {
          users.push(user);
        }
      }
    });
    Order.find((err, ordersFound) => {
      if (err) {
        return handleError(500, req, res);
      }
      ordersFound.forEach((order) => {
        if (order.createdAt) {
          const dateOrder = new Date(order.createdAt);
          const betweenDates = moment(dateOrder).isBetween(
            dateToEvaluate,
            today
          );
          if (betweenDates) {
            orders.push(order);
            money += order.price;
          }
        }
      });
    });
    return handleResponse(200, req, res, {
      users: { users, count: users.length },
      orders: { orders, count: orders.length },
      totalMoney: money,
    });
  });
};

module.exports = {
  getGeneralDataView,
};
