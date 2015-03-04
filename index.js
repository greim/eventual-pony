/*
 * Copyright (c) 2015 by Greg Reimer <gregreimer@gmail.com>
 * MIT License. See license.txt for more info.
 */

var Writable = require('./lib/writable')
  , Readable = require('./lib/readable')
  , Duplex = require('./lib/duplex')
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

  duplex: function(opts, writeToMe, readFromMe) {
    if (typeof opts === 'function') {
      var args = [].slice.call(arguments);
      opts = {};
      writeToMe = args[0];
      readFromMe = args[1];
    }
    opts || (opts = {});
    return new Duplex(opts, writeToMe, readFromMe);
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
