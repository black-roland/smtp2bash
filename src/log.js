'use strict';

var Winston = require('winston');

var winston = new Winston.Logger({
  transports: [
    new Winston.transports.Console({
      timestamp: true,
      colorize: true,
      level: 'debug',
    }),
  ]
});

module.exports = winston;
