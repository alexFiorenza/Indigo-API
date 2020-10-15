//**Dependencies**/
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
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
const PORT = process.env.PORT || 3000;
let mongoUrl = '';
if (PORT === 3000) {
  mongoUrl = 'mongodb://localhost:/indigo';
} else {
  //TODO connect to mongo cluster
}

//**Middlewares**/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(fileupload());
app.use('/public', express.static(path.join(__dirname, 'uploads/')));
app.use('/api/user', userRoutes);
app.use('/api/product', productRoutes);
app.use('/api/orders', orderRoutes);

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
