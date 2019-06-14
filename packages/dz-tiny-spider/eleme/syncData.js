const { sqlquery } = require('../utils')

let count = 1

const run = () => {
  const all = []
  const shopIds = []
  const already = []
  sqlquery(`select shopId, name, city, province, address, phone, monthly, deliverType, deliverFee, deliverTime, period, grid  from eleme1031 where city in ('深圳市')`).then(res => {
    res.map(e => {
      if (!~shopIds.indexOf(e.shopId)) {
        shopIds.push(e.shopId)
        all.push(e)
      }
    })
    sqlquery(`select shopId, name, city, province, address, phone, monthly, deliverType, deliverFee, deliverTime, period, grid  from elemes1031 where city in ('深圳市')`).then(_res => {
      _res.map(e1 => {
        already.push(e1.shopId)
      })
      for (let i = 0; i < all.length; i++) {
        if (!~already.indexOf(all[i].shopId)) {
          sqlquery("INSERT INTO elemes1031 SET ?", all[i]).then(r3 => {
            console.log('success ========= count is: ', count++)
          })
        }
      }
    })
  })
}

run()