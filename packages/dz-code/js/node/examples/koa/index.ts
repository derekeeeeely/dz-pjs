import koa from 'koa'
import compose from 'koa-compose'
import routes from './server'
// koa application object
const app = new koa()

// middleware - async function
app.use(async (ctx, next) => {
  const start = Date.now()
  // invoke next middleware, which leads 'common xxx' being consoled first
  await next()
  const ms = Date.now() - start
  ctx.set('X-Response-Time', `${ms}ms`)
  // console.log(`async ${ctx.method} ${ctx.url} - ${ms}ms`)
})

// middleware - common function
app.use((ctx, next) => {
  const start = Date.now();
  // invoke next middleware, which sets response body
  return next()
    .then(() => {
      const ms = Date.now() - start;
      console.log(`common ${ctx.method} ${ctx.url} - ${ms}ms`);
    });
});

app.use((ctx, next) => {
  ctx.body = 'hello world'
})

async function a (ctx, next) {
  next()
}
async function b (ctx, next) {
  next()
}

// merge middlewares
const all = compose([a, b]);
app.use(all)


app.listen(3011)
