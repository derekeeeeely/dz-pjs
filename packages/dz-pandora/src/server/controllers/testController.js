const Router = require('koa-router')
const { controller, sqlquery } = require('../utils')
const moment = require('moment')

const router = new Router()

router.get('/api/test', controller(async (params, query, body, context) => {
  return {
    data: true
  }
}))

router.get('/api/juejin/today', controller(async (params, query, body, context) => {
  const today = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
  const yesterday = moment(new Date()).format('YYYY-MM-DD 00:00:00')
  const result = await sqlquery(`select * from test where date < '${today}' and date > '${yesterday}'`)
  return {
    data: result
  }
}))

module.exports = router
