var IO = require('fs');

var logsDirectory = './logs';

if (!IO.existsSync(logsDirectory)) {
  IO.mkdirSync(logsDirectory);
}

var winston = require('winston');
winston.emitErrs = true;

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      level: 'silly',
      filename: logsDirectory + '/logs.log',
      json: false,
      maxsize: 5242880, //5MB
      maxFiles: 10,
    })
  ]
});

module.exports = logger;