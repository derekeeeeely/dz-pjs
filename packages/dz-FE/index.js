const Koa = require('koa')
const path = require('path')
// const router = require('koa-route')
const static = require('koa-static')
const bodyParser = require('koa-bodyparser')
const Readable = require('stream').Readable

const EventEmitter = require('events').EventEmitter
const messageBus = new EventEmitter()
messageBus.setMaxListeners(100)

const app = new Koa()


const staticPath = './frontend/basic'

app.use(bodyParser())
app.use(static(
  path.join(__dirname, staticPath)
))

function RR() {}
RR.prototype = Object.create(new Readable());
RR.prototype._read = function (data) {}

app.use(async (ctx) => {
  if (ctx.request.url === '/test') {
    const result = await new Promise((resolve, reject) => {
      messageBus.on('message', function (data) {
        resolve(data)
      })
    })
    ctx.body = result
  }
  if (ctx.request.url === '/message') {
    messageBus.emit('message', ctx.request.body.message)
    ctx.body = 'done'
  }
  if (ctx.request.url === '/sse') {
    ctx.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    })

    let stream = new RR()
    let count = 1
    stream.push(`event: test1\ndata: ${JSON.stringify({ count: count })}\n\n`)
    ctx.body = stream

    const timer = setInterval(() => {
      stream.push(`event: test1\ndata: ${JSON.stringify({ count: ++count })}\n\n`)
      if (count > 5) {
        clearInterval(timer)
      }
      ctx.body = stream
    }, 2000)
  }
  if (ctx.request.url === '/ws') {

  }
})

// app.use(router.get('/test', (ctx) => {
//   // koa-router的问题，未设置ctx.body时返回404
//   messageBus.on('message', function (data) {
//     ctx.body = data
//   })
// }))

// app.use(router.post('/message', (ctx) => {
//   messageBus.emit('message', ctx.request.body.message)
//   ctx.body = 'done'
// }))

app.listen(5000, () => {
  console.log('starting at port 5000')
})

const server = require('http').createServer(app.callback())
const io = require('socket.io')(server)
io.on('connection', (socket) => {
  console.log('connected')
  socket.on('message', (msg) => {
    console.log(msg)
    io.emit('message', 'hello from server');
  });
});
server.listen('5001')
