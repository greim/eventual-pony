/*
 * Copyright (c) 2015 by Greg Reimer <gregreimer@gmail.com>
 * MIT License. See license.txt for more info.
 */

var pony = require('../index')
  , assert = require('assert')
  , fs = require('fs')

describe('transforms', function(){

  it('should emit "data"', function(done){

    var tr = pony.transform(function* (input, output) {
      yield output(yield input())
    })
    tr.on('data', function(data) {
      assert.strictEqual(data.toString('utf8'), 'hello')
      done()
    }).on('error', done)
    tr.write('hello')
  })

  it('should emit "error" before yield', function(done){

    var tr = pony.transform(function* (input, output) {
      throw new Error('fake')
      yield output(yield input())
    })
    tr.on('end', function(data) {
      done(new Error('should not have ended'))
    }).on('error', function(err){
      assert.strictEqual(err.message, 'fake')
      done();
    })
    tr.write('hello')
  })

  it('should emit "error" after yield', function(done){

    var tr = pony.transform(function* (input, output) {
      yield output(yield input())
      throw new Error('fake')
    })
    tr.on('end', function(data) {
      done(new Error('should not have ended'))
    }).on('error', function(err){
      assert.strictEqual(err.message, 'fake')
      done();
    })
    tr.write('hello')
  })

  it('should pipe to and from "fs" streams', function(done){

    var toDevNull = fs.createWriteStream('/dev/null')
      , dummy = fs.createReadStream(__dirname + '/data/dummy-data.txt')

    var tf = pony.transform(function*(input, output){
      while (true) {
        yield output(yield input())
      }
    })

    toDevNull.on('error', done)
    dummy.on('error', done)
    tf.on('error', done).on('end', done)

    dummy.pipe(tf).pipe(toDevNull)
  })

  it('should send and receive buffers', function(done){

    var tr = pony.transform(function* (input, output) {
      var chunk = yield input()
      assert.ok(chunk instanceof Buffer)
      assert.strictEqual(chunk.toString(), 'hello')
      yield output(chunk)
    })
    tr.on('data', function(data) {
      assert.strictEqual(data.toString('utf8'), 'hello')
      done()
    }).on('error', done)
    tr.write('hello')
  })

  it('should send and receive strings', function(done){

    var tr = pony.transform(function* (input, output) {
      var chunk = yield input('utf8')
      assert.ok(typeof chunk === 'string')
      assert.strictEqual(chunk, 'hello')
      yield output(chunk, 'utf8')
    })
    tr.on('data', function(data) {
      assert.strictEqual(data.toString('utf8'), 'hello')
      done()
    }).on('error', done)
    tr.write('hello')
  })
})

