'use strict';

var simplesmtp = require('simplesmtp');
var process = require('child_process');
var log = require('./log');
var parser = require('./exec-parser');

var smtp = simplesmtp.createServer({
  disableDNSValidation: true,
  disableEHLO: true,
  SMTPBanner: 'smtp2bash',
});

smtp.on('startData', function(connection) {
  log.info('New message for ' + connection.to);
  var spawn = parser.parse(connection);
  log.info('Executing ' + spawn.exec + ' ' + spawn.args.join(' '));
  connection.writeStream = process.spawn(spawn.exec, spawn.args).stdin;
});

smtp.on('data', function(connection, chunk) {
  if (connection.writeStream.writable)
    connection.writeStream.write(chunk);
});

smtp.on('dataReady', function(connection, callback) {
  if (connection.writeStream.writable)
    connection.writeStream.end();
  callback(null, '1');
});

module.exports = smtp;
