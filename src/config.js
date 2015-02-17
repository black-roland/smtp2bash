'use strict';

var _ = require('lodash');

var defaults = require('../defaults.json');
try {
  var config = require('../config.json');
}
catch (err) {
  var config = {};
}

module.exports = _.merge({}, defaults, config);
