import Route from 'koa-router'
const router = new Route()

router.get('/login', async(ctx) => {
  ctx.body = 'login page'
})

export default router
