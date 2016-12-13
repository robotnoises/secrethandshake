const winston = require('winston');
const filesystem = require('./filesystem');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: true
    }),
    new (winston.transports.File)({ 
      filename: filesystem.getLogsDirectory() + '/runtime.log',
      timestamp: true
    })
  ]
});

module.exports = logger;