//**Dependencies**/
const express = require('express');
const app = express();
const db = require('./db/config');
const chalk = require('chalk');
const cors = require('cors');
const fileupload = require('express-fileupload');
const path = require('path');
//**Config vars and imports**/
require('dotenv').config();
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/orders');
const slideRoutes = require('./routes/slides');
const categoryRoutes = require('./routes/categories');
const analyticsRoutes = require('./routes/analytics');
const andreaniRoutes = require('./routes/andreani');
const emailRoutes = require('./routes/email');
const PORT = process.env.PORT || 3000;
var mongoUrl;
if (process.env.DEV) {
  mongoUrl = 'mongodb://localhost:/indigo';
} else {
  mongoUrl = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PASSWORD}@${process.env.DB_CLUSTER}.yakjv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
}
//**Middlewares**/
app.use(cors());
app.use(express.urlencoded());
app.use(express.json());
app.use(fileupload());
//**Routes**/
app.use('/public', express.static(path.join(__dirname, 'uploads/')));
app.get('/', (req, res) => {
  return res.status(200).json({
    ok: true,
    response: 'Api working properly',
  });
});
app.use('/api/user', userRoutes);
app.use('/api/product', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/slides', slideRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/andreani', andreaniRoutes);
app.use('/api/email', emailRoutes);
//**Connection to Database and server**/
db(mongoUrl)
  .then((resp) => {
    app.listen(PORT, () => {
      PORT === 3000
        ? console.log(
            `Server runnning on port: ${chalk.blue('http://localhost:3000')}`
          )
        : false;
    });
  })
  .catch((err) => new Error(err));
