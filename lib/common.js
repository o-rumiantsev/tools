'use strict';

const doNothing = () => {};

const extractCallback = args => args.pop();

const asyncify = fn =>
  (...args) => {
    const cb = extractCallback(args);
    const result = fn(...args);
    process.nextTick(
      () => cb(null, result)
    );
  };

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
