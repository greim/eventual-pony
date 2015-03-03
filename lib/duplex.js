/*
 * Copyright (c) 2015 by Greg Reimer <gregreimer@gmail.com>
 * MIT License. See license.txt for more info.
 */

var stream = require('stream')
  , _ = require('lodash')
  , iterationHelper = require('./writable-stream-iteration-helper')
  , util = require('util')
  , co = require('co')
  , unresolved = require('./unresolved')
  , byEncoding = require('./by-encoding')

// -----------------------------------------------------

function Duplex(opts, genFnWrite, genFnRead) {
  stream.Duplex.call(this, opts);
  var self = this;

  // writable setup...
  this._ponyIncomingValues = iterationHelper(this);
  function input(enc) {
    var prom = self._ponyIncomingValues.next().value;
    if (enc) {
      return prom.then(byEncoding(enc));
    } else {
      return prom;
    }
  }
  co(genFnWrite.bind(this, input))
  .catch(function(err) { self.emit('error', err); })

  // readable setup...
  this._ponySending = unresolved();
  function output(data, enc) {
    return self._ponySending.then(function() {
      if (!self.push(data, enc)) {
        self._ponySending = unresolved();
      }
    });
  }
  co(genFnRead.bind(this, output))
  .then(function() { self.push(null); })
  .catch(function(err) { self.emit('error', err); });
}

util.inherits(Duplex, stream.Duplex);

Duplex.prototype._write = function(chunk, enc, callback) {
  this.emit('_ponyWriteCalled', chunk, enc, callback);
};

Duplex.prototype._read = function() {
  this._ponySending.resolve();
};

// -----------------------------------------------------

module.exports = Duplex;
