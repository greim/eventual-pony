/*
 * Copyright (c) 2015 by Greg Reimer <gregreimer@gmail.com>
 * MIT License. See license.txt for more info.
 */

var _ = require('lodash')

module.exports = _.memoize(function(enc){
  return function(thing){
    return thing.toString(enc);
  };
});
