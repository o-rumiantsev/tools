'use strict';

const common = require('./common.js');
const dataCollector = require('./dataCollector.js');

const sequential = (
  fns,
  context,
  callback
) => {
  if (!callback) {
    callback = context || common.doNothing;
    context = {};
  }

  let count = fns.length;
  let index = 0;

  const done = (err, data) => {
    if (err) {
      callback(err);
      return;
    }

    Object.assign(context, data);

    if (index === count) {
      callback(null, context);
      return;
    }

    fns[index++](context, done);
  };

  done();
};

const parallel = (
  fns,
  context,
  callback
) => {
  if (!callback) {
    callback = context;
    context = {};
  }

  let count = fns.length;
  let counter = 0;
  let failed = false;

  const done = (err, data) => {
    if (failed) return;

    if (err) {
      failed = true;
      callback(err);
      return;
    }

    Object.assign(context, data);

    if (++counter === count)
      callback(null, context);
  };

  fns.forEach(fn => fn(context, done));
};

const compose = (fns, data, done) => {};

const map = (
  array,
  fn,
  callback
) => {
  const count = array.length;
  const result = new Array(count);
  let counter = 0;
  let failed = false;

  const done = index =>
    (err, value) => {
      if (failed) return;
      if (err) {
        failed = true;
        callback(err);
        return;
      }

      result[index] = value;

      if (++counter === count)
        callback(null, result);
    };

  array.forEach(
    (item, index) => fn(item, done(index))
  );
};

const each = (
  array,
  fn,
  callback
) => {
  const count = array.length;
  if (!count) callback(null);

  let counter = 0;
  let failed = false;

  const done = (err, data) => {
    if (failed) return;
    if (err) {
      failed = true;
      callback(err);
      return;
    }

    if (++counter === count)
      callback(null);
  };

  array.forEach(item => fn(item, done));
};

module.exports = {
  compose: common.curry(compose),
  sequential,
  parallel,
  map,
  each
};
