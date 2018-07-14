'use strict';

const doNothing = () => {};

const extractCallback = args => args.pop();

const asyncify = fn => (...args) => process
  .nextTick(() => {
    const cb = extractCallback(args);
    try {
      const result = fn(...args);
      cb(null, result);
    } catch (error) {
      cb(error);
    }
  });

const curry = fn =>
  (...args) => fn.length > args.length ?
    curry(fn.bind(null, ...args)) :
    fn(...args);

module.exports = {
  doNothing,
  extractCallback,
  asyncify,
  curry
};
