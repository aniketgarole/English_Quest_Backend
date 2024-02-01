const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const accessLogStream = fs.createWriteStream(path.join(__dirname, '../requests.log'), { flags: 'a' });

const loggerMiddleware = () => {
  return morgan('combined', { stream: accessLogStream });
};


console.log("inside logger middleware")

module.exports = loggerMiddleware;