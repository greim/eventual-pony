/*
 * Copyright (c) 2015 by Greg Reimer <gregreimer@gmail.com>
 * MIT License. See license.txt for more info.
 */

var pony = require('../index')

// execute a series of commands
module.exports = function(filter) {
  pony.writable({
    objectMode: true
  }, function *(input){
    while (true) {
      let command = yield input()
      command()
    }
  })
}
