# Eventual Pony

Process streams with generators and [co](https://www.npmjs.com/package/co).

 * Write code and handle exceptions in sync style.
 * Stream2 writable, readable, duplex and transform.
 * Has `pipe()`ing and backpressure.
 * Works natively on io.js. Works on node with `--harmony`.
 * Backed by [co](https://www.npmjs.com/package/co) so do any co stuff.
 * Great name.

## Install

```bash
npm install eventual-pony
```

## Silly example

```js
var pony = require('eventual-pony')

var upperify = pony.transform(function*(input, output){
  while (true) {
    var chunk = yield input('utf8')
    chunk = chunk.toUpperCase()
    yield output(chunk, 'utf8')
  }
})

fs.createReadStream('./foo')
.pipe(upperify)
.pipe(fs.createWriteStream('./foo-upper'))
```

## API Documentation

### pony.writable([opts], genFunc(input))

Create a [writable stream](https://iojs.org/api/stream.html#stream_class_stream_writable).

 * **opts** - Options object passed to [native Writable constructor](https://iojs.org/api/stream.html#stream_new_stream_writable_options). (optional)
 * **input([encoding])** - Returns yieldable for next available upstream value.  If not in object mode and `encoding` is provided, produces string, otherwise a buffer.

```js
// consume a stream of numbers to produce a sum
var sum = 0
pony.writable({
  objectMode: true
}, function* (input){
  while (true) {
    sum += yield input()
  }
}).on('end', function(){
  console.log(sum)
})
```

### pony.readable([opts], genFunc(output))

Create a [readable stream](https://iojs.org/api/stream.html#stream_class_stream_readable).

 * **opts** - Options object passed to [native Readable constructor](https://iojs.org/api/stream.html#stream_new_stream_readable_options). (optional)
 * **output(value, [encoding])** - Sends a value downstream. Returns a yieldable that resolves more or less quickly depending on how fast downstream is accepting data.

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

### pony.duplex([opts], writeFunc(input), readFunc(output))

Create a [duplex stream](https://iojs.org/api/stream.html#stream_class_stream_duplex).

 * **opts** - Options object passed to [native Duplex constructor](https://iojs.org/api/stream.html#stream_new_stream_duplex_options). (optional)
 * **writeFunc()** - See `genFunc` in writable above.
 * **readFunc()** - See `genFunc` in readable above.

```js
/* An online AI chatbot that ignores you and repeats '42' over and over.
 * If the bot cared about you, this would be a transform since then the
 * input would be causally related to the output. However since the bot
 * is ignoring you this is best modeled as a duplex.
 */

aiBot = pony.duplex(function *(input) {
  // doesn't care, ignores input
  while (true) let q = yield input(), q = null
}, function *(output) {
  // already have an answer
  while (true) yield output('42'), yield wait(333)
})

net.createServer(c => c.pipe(aiBot).pipe(c)).listen(8124)
```

### pony.transform([opts], genFunc(input, output))

Create a [transform stream](https://iojs.org/api/stream.html#stream_class_stream_transform).

 * **opts** - Options object passed to [native Transform constructor](https://iojs.org/api/stream.html#stream_new_stream_transform_options). (optional)
 * **input([encoding])** - Returns a yieldable on next available upstream value. If not in object mode and `encoding` is provided, produces string, otherwise a buffer.
 * **input.ended()** - Once this returns `true` the input is ended, so `output()` any remaining stuff.
 * **output(value, [encoding])** - Sends a value downstream. Returns a yieldable that resolves more or less quickly depending on how fast downstream is accepting data.

```js
// dedupe an object stream
upstream.pipe(pony.transform({
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

## Change log

 * 0.1.0 - Added `duplex()` and updated api docs.
 * 0.0.2 - Updated header comments in code files.
 * 0.0.1 - Added a repository field in package.json.
 * 0.0.0 - First version. Has readables, writables and transforms.

## Why "Eventual Pony"?

If you're good little boys and girls, eventually you'll get a pony.

