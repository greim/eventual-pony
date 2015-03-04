/*
 * Copyright (c) 2015 by Greg Reimer <gregreimer@gmail.com>
 * MIT License. See license.txt for more info.
 */

var pony = require('../index')
  , assert = require('assert')
  , fs = require('fs')

describe('duplexes', function(){

  it('should emit "data"', function(done){

    var dx = pony.duplex(function* (input) {
      yield input()
    }, function* (output) {
      yield output('hello')
    })
    dx.on('data', function(data) {
      assert.strictEqual(data.toString('utf8'), 'hello')
      done()
    }).on('error', done)
    dx.write('foox')
  })

  it('writable side should emit "error" before yield', function(done){

    var dx = pony.duplex(function* (input) {
      throw new Error('fake')
      yield input()
    }, function* (output) {
      yield output('yes')
    })
    dx.on('end', function(data) {
      done(new Error('should not have ended'))
    }).on('error', function(err){
      assert.strictEqual(err.message, 'fake')
      done();
    })
    dx.write('foo')
  })

  it('writable side should emit "error" after yield', function(done){

    var dx = pony.duplex(function* (input) {
      yield input()
      throw new Error('fake')
    }, function* (output) {
      yield output('yes')
    })
    dx.on('end', function(data) {
      done(new Error('should not have ended'))
    }).on('error', function(err){
      assert.strictEqual(err.message, 'fake')
      done();
    })
    dx.write('foo')
  })

  it('readable side should emit "error" before yield', function(done){

    var dx = pony.duplex(function* (input) {
      yield input()
    }, function* (output) {
      throw new Error('fake')
      yield output('hello')
    })
    dx.on('end', function(data) {
      done(new Error('should not have ended'))
    }).on('error', function(err){
      assert.strictEqual(err.message, 'fake')
      done();
    }).on('data', function(){
      // do nothing, puts it in flowing mode
    })
  })

  it('readable side should emit "error" after yield', function(done){

    var dx = pony.duplex(function* (input) {
      yield input()
    }, function* (output) {
      yield output('hello')
      throw new Error('fake')
    })
    dx.on('end', function(data) {
      done(new Error('should not have ended'))
    }).on('error', function(err){
      assert.strictEqual(err.message, 'fake')
      done();
    }).on('data', function(){
      // do nothing, puts it in flowing mode
    })
  })

  it('should pipe to and from "fs" streams', function(done){

    var toDevNull = fs.createWriteStream('/dev/null')
      , dummy = fs.createReadStream(__dirname + '/data/dummy-data.txt')

    var tf = pony.duplex(function*(input){
      while (true) {
        yield input()
      }
    }, function*(output){
      var i = 100
      while (i--) {
        yield output('hello')
      }
    })

    toDevNull.on('error', done)
    dummy.on('error', done)
    tf.on('error', done).on('end', done)

    dummy.pipe(tf).pipe(toDevNull)
  })

  it('should send buffers', function(done){

    var dx = pony.duplex(function* (input) {
      yield input()
    }, function* (output) {
      yield output(Buffer('hello'))
    })
    dx.on('data', function(data) {
      assert.strictEqual(data.toString('utf8'), 'hello')
      done()
    }).on('error', done)
  })

  it('should receive buffers', function(done){

    var dx = pony.duplex(function* (input) {
      var chunk = yield input()
      assert.ok(chunk instanceof Buffer)
      assert.strictEqual(chunk.toString(), 'hello')
      done()
    }, function* (output) {
      yield output(Buffer('hello'))
    })
    dx.on('error', done)
    dx.write('hello')
  })

  it('should receive strings', function(done){

    var dx = pony.duplex(function* (input) {
      var chunk = yield input('utf8')
      assert.ok(typeof chunk === 'string')
      assert.strictEqual(chunk, 'hello')
      done()
    }, function* (output) {
      yield output('hello', 'utf8')
    })
    dx.on('error', done)
    dx.write('hello')
  })

  it('should send strings', function(done){

    var dx = pony.duplex(function* (input) {
      var chunk = yield input('utf8')
    }, function* (output) {
      yield output('hello', 'utf8')
    })
    dx.on('data', function(data) {
      assert.strictEqual(data.toString('utf8'), 'hello')
      done()
    }).on('error', done)
  })
})

