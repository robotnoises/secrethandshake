const winston = require('winston');
const filesystem = require('./../backend/services/filesystem');

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