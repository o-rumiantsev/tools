'use strict';

const tools = require('.');
const fs = require('fs');

const FILES = [
  'async.js',
  'array.js',
  'common.js',
  'dataCollector.js'
]
  .map(filename => './lib/' + filename);

const onRead = (path, callback) =>
  (err, buffer) => (
    err ?
      callback(err) :
      callback(null, { path, length: buffer.length })
  );

const readFile = path =>
  (data, callback) => fs.readFile(path, onRead(path, callback));

const fns = FILES
  .map(path => readFile(path));

const mapFiles = (path, callback) => fs
  .readFile(path, onRead(path, callback));




const test = [
  (data, cb) => (
    console.log('\n==== tools.async.sequential ====\n'),
    tools.async
      .sequential(fns, (err, res) => (
        err ?
          console.error(err) :
          console.log(res),
        cb(err, res)
      ))
  ),

  (data, cb) => (
    console.log('\n==== tools.async.parallel ====\n'),
    tools.async
      .parallel(fns, (err, res) => (
        err ?
          console.error(err) :
          console.log(res),
        cb(err, res)
      ))
  ),

  (data, cb) => (
    console.log('\n==== tools.async.map ====\n'),
    tools.async
      .map(
        FILES,
        mapFiles,
        (err, res) => (
          err ?
            console.error(err) :
            console.log(res),
          cb(err, res)
        )
      )
  )
];

tools.async
  .sequential(test);
