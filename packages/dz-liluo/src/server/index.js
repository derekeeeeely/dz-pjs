const Koa = require('koa')
const routes = require('./routes')
const cors = require("@koa/cors")

const app = new Koa()
app.use(cors())
const PORT = 3000

app.use(async (ctx, next) => {
  try {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
  } catch (error) {
    console.log(error)
  }
})

routes.map(ele => {
  app.use(ele.routes()).use(ele.allowedMethods());
});

app.listen(PORT)
console.log(`server is up at ${PORT}`)