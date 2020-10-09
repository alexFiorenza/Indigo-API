//**Dependencies**/
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./db/config');
const chalk = require('chalk');

//**Config vars and imports**/
require('dotenv').config();
const userRoutes = require('./routes/user');
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
app.use('/api/user', userRoutes);

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
