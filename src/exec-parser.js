'use strict';

var config = require('./config');
var _ = require('lodash');

var parse = function(connection) {
  return {
    exec: _.template(config.exec)(connection),
    args: _.map(config.exec_arguments, function(argument) {
      return _.template(argument)(connection);
    }),
  };
};

module.exports.parse = parse;
