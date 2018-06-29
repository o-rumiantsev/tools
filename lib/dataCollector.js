'use strict';

const common = require('./common.js');

const collector = (expected, storage = {}) => {
  let [timedOut, canceled, failed, ended] = new Array(4).fill(false);
  let onDone = common.doNothing;

  const _pick = (key, value) =>
    Array.isArray(storage) ?
      storage.push(value) :
      storage[key] = value;

  const _fail = (key, err) => (
    failed = true,
    onDone(err, storage),
    onDone = common.doNothing
  );

  const _done = () => (
    onDone(null, storage),
    ended = true,
    onDone = common.doNothing
  );

  const methods = {
    pick: (key, value) => (
      ended || failed || canceled || timedOut ?
        common.doNothing() :
        _pick(key, value),
      methods
    ),
    fail: (key, err) => (
      _fail(key, err),
      methods
    ),
    take: (key, fn, ...args) => (
      fn(...args, (err, value) => (
        err ?
        methods.fail(key, err) :
        methods.pick(key, value)
      )),
      methods
    ),
    setStorage: newStorage => (
      storage = newStorage,
      methods
    ),
    timeout: msecs => (
      setTimeout(
        () => (timedOut = true), msecs
      ),
      methods
    ),
    done: fn => (
      fn ?
        (onDone = fn) :
        _done(),
      methods
    ),
    cancel: () => (canceled = true),
    clear: () => (storage = {}),
    getStorage: () => storage
  };

  return methods;
};

module.exports = collector;
