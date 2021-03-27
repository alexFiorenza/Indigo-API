const mongoose = require('mongoose');
const chalk = require('chalk');
module.exports = async (url) => {
  try {
    await mongoose.connect(
      url,
      { useUnifiedTopology: true, useNewUrlParser: true },
      (err) => {
        return console.log(
          `Succesfully connected to: ${chalk.green('MongoDb')}`
        );
      }
    );
  } catch (error) {
    return error;
  }
};
