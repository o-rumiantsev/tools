'use strict';

const tools = {};

const lib = [
  'async',
  'array',
  'common',
  'dataCollector'
]
  .map(
    path => (tools[path] = require('./lib/' + path + '.js'))
  );

module.exports = tools;
