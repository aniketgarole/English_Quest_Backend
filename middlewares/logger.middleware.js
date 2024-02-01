const morgan = require('morgan');

const loggerMiddleware = () => {
  return morgan('combined');
};

module.exports = loggerMiddleware;