# Eventual Pony

Process streams with generators and [co](https://www.npmjs.com/package/co).

 * Write code and handle exceptions in sync style.
 * Stream2 readables, writables and transforms.
 * Has `pipe()`ing and backpressure.
 * Backed by [co](https://www.npmjs.com/package/co) so do any co stuff.
 * Great name.

## API Documentation

```js
var pony = require('eventual-pony')
```

### pony.writable([opts], genFunc(input))

Create a [writable stream](https://iojs.org/api/stream.html#stream_class_stream_writable).

 * **opts** - Options object passed to [native Writable constructor](https://iojs.org/api/stream.html#stream_new_stream_writable_options). (optional)
 * **input([encoding])** - Returns [yieldable](https://www.npmjs.com/package/co#yieldables) for next available upstream value.  If not in object mode and `encoding` is provided, produces string, otherwise a buffer.

```js
// consume a stream of numbers to produce a sum
var sum = 0
pony({
  objectMode: true
}, function* (input){
  sum += yield input()
}).on('end', function(){
  console.log(sum)
})
```

### pony.readable([opts], genFunc(output))

Create a [readable stream](https://iojs.org/api/stream.html#stream_class_stream_readable).

 * **opts** - Options object passed to [native Readable constructor](https://iojs.org/api/stream.html#stream_new_stream_readable_options). (optional)
 * **output(value, [encoding])** - Sends a value downstream. Returns a [yieldable](https://www.npmjs.com/package/co#yieldables) that resolves more or less quickly depending on how fast downstream is accepting data.

```js
// stream of fibonacci numbers
pony.readable({
  objectMode: true
}, function* (output){
  var f1 = 1
    , f2 = 1
  while (true) {
    let result = f2
    f2 = f1
    f1 = f1 + result
    yield output(result)
  }
}).pipe(downstream)
```

### pony.transform([opts], genFunc(input, output))

Create a [transform stream](https://iojs.org/api/stream.html#stream_class_stream_transform).

 * **opts** - Options object passed to [native Transform constructor](https://iojs.org/api/stream.html#stream_new_stream_transform_options). (optional)
 * **input([encoding])** - Returns a [yieldable](https://www.npmjs.com/package/co#yieldables) on next available upstream value. If not in object mode and `encoding` is provided, produces string, otherwise a buffer.
 * **input.ended()** - Once this returns `true` the input is ended, so `output()` any remaining stuff.
 * **output(value, [encoding])** - Sends a value downstream. Returns a [yieldable](https://www.npmjs.com/package/co#yieldables) that resolves more or less quickly depending on how fast downstream is accepting data.

```js
// dedupe an object stream
upstream.pipe(pony({
  objectMode: true
}, function* (inp, out){
  var uniq = new Set()
  var chunk = yield inp()
  if (!uniq.has(chunk)) {
    uniq.add(chunk)
    yield out(chunk)
  }
})).pipe(downstream)
```

## Why "Eventual Pony"?

Choosing npm names is getting hard...

