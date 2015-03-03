/*
 * Copyright (c) 2015 by Greg Reimer <gregreimer@gmail.com>
 * All Rights Reserved.
 */

var Readable = require('./lib/readable')
  , Writable = require('./lib/writable')
  , Transform = require('./lib/transform')
  , co = require('co')

module.exports = {

  readable: function(opts, gen) {
    if (typeof opts === 'function') {
      gen = opts, opts = {};
    }
    opts || (opts = {});
    return new Readable(opts, gen);
  },

  writable: function(opts, gen) {
    if (typeof opts === 'function') {
      gen = opts, opts = {};
    }
    opts || (opts = {});
    return new Writable(opts, gen);
  },

  transform: function(opts, gen) {
    if (typeof opts === 'function') {
      gen = opts, opts = {};
    }
    opts || (opts = {});
    return new Transform(opts, gen);
  }
};

// expose our copy of co 
module.exports.co = co;
