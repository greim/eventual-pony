/*
 * Copyright (c) 2015 by Greg Reimer <gregreimer@gmail.com>
 * MIT License. See license.txt for more info.
 */

var EventEmitter = require('events').EventEmitter
  , Promise = require('native-or-bluebird')

/*
 * This converts a stream into an iterable of promises.
 * Every time you call next() it returns a promise for
 * the next thing that was or will be written to that
 * stream via the internal call to _transform().
 */

module.exports = function* (stream) {
  var promIdx = 0
    , emitIdx = 0
    , numEmitter = new EventEmitter()
    , cache = new Map()

  /*
  P = emitIdx - promIdx
  P > 0: data is being written to us faster that we're consuming
  P < 0: we're consuming faster than data is being written to us
  */

  stream.on('_ponyWriteCalled', function(chunk, enc, callback) {
    if (emitIdx > promIdx) {
      cache.set(emitIdx, chunk);
      // TODO: figure out how to do this better
      setTimeout(callback, emitIdx - promIdx);
    } else {
      numEmitter.emit(emitIdx, chunk);
      callback();
    }
    emitIdx++;
  });
  while (true) {
    if (cache.has(promIdx)) {
      var thing = cache.get(promIdx);
      cache.delete(promIdx);
      yield Promise.resolve(thing);
    } else if (stream._ended) {
      yield new Promise(function(resolve, reject) {
        reject(new Error('the stream has ended'));
      });
    } else {
      yield new Promise(function(resolve) {
        numEmitter.once(promIdx, resolve);
      });
    }
    promIdx++;
  }
}
