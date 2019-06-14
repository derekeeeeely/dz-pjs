const Router = require("koa-router")
const xlsx = require("node-xlsx")
const multer = require("koa-multer")
const { ctr, sqlQuery } = require("../utils")
// const dorapan = require("dorapan")
// const { getProxy } = require("pandora")

const router = new Router()
const upload = multer({});

router.get('/api/test', ctr(async (params, query, body, context) => {
  // console.log(123, getProxy);
  // const c = await getProxy("serviceB")
  // console.log(c, 1241412)
  // const test = await c.test()
  // console.log(test);
  // const result1 = dorapan.getService("serviceA");
  // const result2 = dorapan.getService("serviceC");
  // console.log(result1, typeof result1);
  // console.log(result2, typeof result2);
  // result2.stop()
  // console.log(result1, typeof(result1))
  // console.log(result2, typeof result2);
  return {
    data: true
  }
}))

router.post("/api/upload", upload.any(), ctr(async (params, query, body, context) => {
  const { req } = context
  const file = req.files[0]
  const workSheetsFromBuffer = xlsx.parse(file.buffer)
  const sheet1 = workSheetsFromBuffer[0]
  const data = []
  // sheet1.data.map((item, index) => {
  //   if (item.length && index > 1) {
  //     data.push({ orderId: item[0], ems: item[1], trackId: item[2] });
  //   }
  // })
  // for (let i = 0; i < data.length; i++) {
  //   let res = await sqlQuery("INSERT INTO test SET ?", data[i])
  // }
  return {
    data: true
  }
}))

router.get("/api/test/list", ctr(async (params, query, body, context) => {
  const res = await sqlQuery("SELECT * FROM test")
  return {
    data: res
  }
}))

module.exports = router