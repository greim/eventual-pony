/*
 * Copyright (c) 2015 by Greg Reimer <gregreimer@gmail.com>
 * All Rights Reserved.
 */

var Promise = require('native-or-bluebird')

/*
 * This creates an unresolved promise and
 * sticks its resolve function on the outside
 * of it so that someone else can resolve it.
 * There's probably a better way to do this.
 */

module.exports = function() {
  var resolver, prom = new Promise(function(resolve){
    resolver = resolve;
  });
  prom.resolve = resolver;
  return prom;
};
