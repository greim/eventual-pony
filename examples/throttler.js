/*
 * Copyright (c) 2015 by Greg Reimer <gregreimer@gmail.com>
 * MIT License. See license.txt for more info.
 */

var pony = require('../index')

// a bytes-per-second stream throttler
module.exports = function(rate /* bytes per second */) {
  pony.transform(function *(input, output){
    while (true) {
      let chunk = yield input()
        , time = (len / rate) * 1000
      yield wait(time)
      yield output(chunk)
    }
  })
}

function wait(time) {
  return new Promise(function(resolve) {
    setTimeout(resolve, time)
  })
}