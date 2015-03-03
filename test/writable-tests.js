/*
 * Copyright (c) 2015 by Greg Reimer <gregreimer@gmail.com>
 * All Rights Reserved.
 */

var pony = require('../index')
  , assert = require('assert')
  , fs = require('fs')

describe('writables', function(){

  it('should receive a write()', function(done){

    var wr = pony.writable(function* (input) {
      var data = yield input('utf8')
      assert.strictEqual(data, 'hello')
      done()
    })
    wr.write('hello')
    wr.on('error', done)
  })

  it('should receive an end()', function(done){

    var wr = pony.writable(function* (input) {
      var data = yield input('utf8')
      assert.strictEqual(data, 'hello')
      done()
    })
    wr.end('hello')
    wr.on('error', done)
  })

  it('should emit "error" before yield', function(done){

    var wr = pony.writable(function* (input) {
      throw new Error('fake')
      var data = yield input('utf8')
    })
    wr.end('hello')
    wr.on('error', function(err){
      assert.strictEqual(err.message, 'fake')
      done()
    })
  })

  it('should emit "error" after yield', function(done){

    var wr = pony.writable(function* (input) {
      var data = yield input('utf8')
      throw new Error('fake')
    })
    wr.end('hello')
    wr.on('error', function(err){
      assert.strictEqual(err.message, 'fake')
      done()
    })
  })

  it('should read from a "fs" readable', function(done){
    var dummy = fs.createReadStream(__dirname + '/data/dummy-data.txt', 'utf8')
    var writeme = pony.writable(function*(input){
      try {
        while (true) {
          var chunk = yield input()
        }
      } catch(ex) {
        done(ex)
      }
    })
    writeme.on('error', done)
    dummy.on('end', done).on('error', done)
    dummy.pipe(writeme)
  })

  it('should receive buffers', function(done){

    var wr = pony.writable(function* (input) {
      var data = yield input()
      assert.ok(data instanceof Buffer)
      assert.strictEqual(data.toString('utf8'), 'hello')
      done()
    })
    wr.write('hello')
    wr.on('error', done)
  })

  it('should receive strings', function(done){

    var wr = pony.writable(function* (input) {
      var data = yield input('utf8')
      assert.ok(typeof data === 'string')
      assert.strictEqual(data, 'hello')
      done()
    })
    wr.write('hello')
    wr.on('error', done)
  })
})

