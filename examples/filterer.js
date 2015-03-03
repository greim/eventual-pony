/*
 * Copyright (c) 2015 by Greg Reimer <gregreimer@gmail.com>
 * MIT License. See license.txt for more info.
 */

var pony = require('../index')

// filter a stream of values by some arbitrary criteria
module.exports = function(filter) {
  pony.transform({
    objectMode: true
  }, function *(input, output){
    while (true) {
      let item = yield input()
      if (filter(item)) {
        yield output(item)
      }
    }
  })
}
