/*
 * Copyright (c) 2015 by Greg Reimer <gregreimer@gmail.com>
 * MIT License. See license.txt for more info.
 */

var Writable = require('./lib/writable')
  , Readable = require('./lib/readable')
  , Duplex = require('./lib/transform')
  , Transform = require('./lib/transform')
  , co = require('co')

module.exports = {

  writable: function(opts, gen) {
    if (typeof opts === 'function') {
      gen = opts, opts = {};
    }
    opts || (opts = {});
    return new Writable(opts, gen);
  },

  readable: function(opts, gen) {
    if (typeof opts === 'function') {
      gen = opts, opts = {};
    }
    opts || (opts = {});
    return new Readable(opts, gen);
  },

  duplex: function(opts, genWrite, genRead) {
    if (typeof opts === 'function') {
      gen = opts, opts = {};
    }
    opts || (opts = {});
    return new Duplex(opts, genWrite, genRead);
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
