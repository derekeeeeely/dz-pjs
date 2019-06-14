const Koa = require('koa')
const cors = require('@koa/cors')
const routes = require('./routes')

const port = 2345
const app = new Koa()

app.use(cors())

app.use(async (ctx, next) => {
  try {
    const startTime = Date.now()
    await next()
    const cost = Date.now() - startTime
    console.log(`${ctx.method} ${ctx.url} - ${cost}ms`)
  } catch (error) {
    console.log(error)
  }
})

routes.map(ele => {
  app.use(ele.routes()).use(ele.allowedMethods())
})

app.listen(port)

console.log(`server is up at 127.0.0.1:${port} with pid: ${process.pid}`)