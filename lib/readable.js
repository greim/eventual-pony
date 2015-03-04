/*
 * Copyright (c) 2015 by Greg Reimer <gregreimer@gmail.com>
 * MIT License. See license.txt for more info.
 */

var stream = require('stream')
  , util = require('util')
  , co = require('co')
  , unresolved = require('./unresolved')

// -----------------------------------------------------

function Readable(opts, sender) {
  stream.Readable.call(this, opts);
  this._ponySending = unresolved();
  var self = this;
  function output(data, enc) {
    return self._ponySending.then(function() {
      if (!self.push(data, enc)) {
        self._ponySending = unresolved();
      }
    });
  }
  co(sender.bind(this, output))
  .then(function() { self.push(null); })
  .catch(function(err) { self.emit('error', err); });
}

util.inherits(Readable, stream.Readable);

Readable.prototype._read = function() {
  this._ponySending.resolve();
};

// -----------------------------------------------------

module.exports = Readable;
