/*
 * Copyright (c) 2015 by Greg Reimer <gregreimer@gmail.com>
 * All Rights Reserved.
 */

var pony = require('../index')
  , assert = require('assert')
  , fs = require('fs')

describe('readables', function(){

  it('should emit "data"', function(done){

    pony.readable(function* (output) {
      yield output('hello')
    }).on('data', function(data) {
      assert.strictEqual(data.toString('utf8'), 'hello')
      done()
    }).on('error', done)
  })

  it('should emit "end"', function(done){

    pony.readable(function* (output) {
      yield output('hello')
    }).on('data', function(data) {
      // do nothing, this just puts it in flowing mode
    }).on('end', function(data) {
      done()
    }).on('error', done)
  })

  it('should emit "data" multiple times', function(done){

    var output = ''
    pony.readable(function* (output) {
      for (var i=0; i<10; i++) {
        yield output(i+'')
      }
    }).on('data', function(data) {
      output += data.toString('utf8')
    }).on('end', function(data) {
      assert.strictEqual(output, '0123456789')
      done()
    }).on('error', done)
  })

  it('should allow delay between "data"', function(done){

    var output = ''
    pony.readable(function* (output) {
      for (var i=0; i<10; i++) {
        yield new Promise(function(res){ setTimeout(res, 2) })
        yield output(i+'')
      }
    }).on('data', function(data) {
      output += data.toString('utf8')
    }).on('end', function(data) {
      assert.strictEqual(output, '0123456789')
      done()
    }).on('error', done)
  })

  it('should emit "error" before yield', function(done){

    pony.readable(function* (output) {
      throw new Error('fake')
      yield output('hello')
    }).on('data', function() {
      done(new Error('should not have got data'))
    }).on('end', function() {
      done(new Error('should not have ended'))
    }).on('error', function(err){
      assert.strictEqual(err.message, 'fake')
      done();
    })
  })

  it('should emit "error" after yield', function(done){

    pony.readable(function* (output) {
      yield output('hello')
      throw new Error('fake')
    }).on('data', function(){
      // do nothing, this just puts it in flowing mode
    }).on('end', function() {
      done(new Error('should not have ended'))
    }).on('error', function(err){
      assert.strictEqual(err.message, 'fake')
      done();
    })
  })

  it('should pipe to a "fs" writable', function(done){
    var readme = pony.readable(function*(output){
      for (var i=0; i<100; i++){
        yield output(i+'')
      }
    })
    readme.pipe(fs.createWriteStream('/dev/null','utf8'))
    readme.on('end', done).on('error', done)
  })

  it('should send buffers', function(done){

    pony.readable(function* (output) {
      yield output(Buffer('hello'))
    }).on('data', function(data) {
      assert.strictEqual(data.toString('utf8'), 'hello')
      done()
    }).on('error', done)
  })

  it('should send strings', function(done){

    pony.readable(function* (output) {
      yield output('hello','utf8')
    }).on('data', function(data) {
      assert.strictEqual(data.toString('utf8'), 'hello')
      done()
    }).on('error', done)
  })
})

