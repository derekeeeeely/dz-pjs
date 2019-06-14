const mysql = require('mysql')
const pool = mysql.createPool({
  host: "119.23.217.75",
  user: 'root',
  password: '12345678',
  database: 'pandora'
})

const controller = (ctr) => {
  return async (ctx, next) => {
    const params = ctx.params
    const body = ctx.request.body
    const query = ctx.query
    ctx.status = 200
    ctx.type = 'json'
    try {
      const { data } = await ctr(params, query, body, ctx)
      ctx.body = { data, success: true }
    } catch (error) {
      ctx.body = { errormessage: error, success: false }
    }
  }
}

const sqlquery = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err)
      } else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err)
          } else {
            resolve(rows)
          }
          connection.release()
        })
      }
    })
  })
}

module.exports = {
  controller,
  sqlquery
}