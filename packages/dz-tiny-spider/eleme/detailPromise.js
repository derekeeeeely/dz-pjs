const colors = require('colors/safe')
const axios = require('axios')
const { sqlquery } = require('./utils')

let count = 1

const headers = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
  'Cookie': 'ubt_ssid=7knf7s2bunmu3i2yfiu6bx2z4phhdpur_2018-05-11; _utrace=1732d2364df33da481ae20fdbd22b716_2018-05-11; perf_ssid=28xlc3s3ohqywx3dumeu9whkofyc5g1g_2018-05-11; eleme__ele_me=8a48eac20cc743413327420954607c95%3A712e65169fc87f9954f92b9da3811e83746c874a; track_id=1526027313|9d0084e51aa416051872f10cf70cfa5fd45a54d8d5e21ca4cb|0259f0cfdebffd0a189a83494831b1ce; USERID=185356818; SID=swfZIDUAeNl6Xo4A8bDAm48RZCqmIUCSO5ag',
}

const run = () => {
  // for (let round = 0; round < 1400; round++) {
    // let round = 1
    sqlquery(`select * from elemes limit 1000`).then(res => {
      Promise.all(res.map(item => {
        return axios.get(`https://www.ele.me/restapi/shopping/restaurant/${item.shopId}?latitude=30.304428&longitude=120.14208&terminal=web`, {
          headers: headers
        }).then(er => {
          return er.data
        })
        // return axios.get(`https://mainsite-restapi.ele.me/pizza/v1/restaurants/${item.shopId}?latitude=30.304428&longitude=120.14208&terminal=weapp`).then(re => {
        //   return re.info
        // })
      })).then(r => {
        for (let i = 0; i < r.length; i++) {
          const deliverType = r[i].delivery_mode ? r[i].delivery_mode.text : ''
          const grid = `${r[i].longitude},${r[i].latitude}`
          const shopId = r[i].id
          sqlquery(`update elemes set deliverType='${deliverType}',grid='${grid}' where shopId=${shopId}`).then((result) => {
            console.log(`商家: ${shopId} 配送方式 has changed, count is ${count++} ------------`)
          }, (error) => {
            console.log(error)
          })
        }
        // console.log(r)
      }).catch(err => console.log(err))
    })
  // }
}

// // 地址转换坐标
// const geocoder = (address) => {
//   return axios.get(`http://restapi.amap.com/v3/geocode/geo?key=87453539f02a65cd6585210fa2e64dc9&address=${encodeURIComponent(address)}`)
//     .then(res => {
//       const resp = res.data
//       if (resp.status == 1 && resp.count >= 1 && resp.geocodes) {
//         return {
//           lgt: resp.geocodes[0].location.split(',')[0],
//           lat: resp.geocodes[0].location.split(',')[1]
//         }
//       } else {
//         return {
//           lgt: '',
//           lat: ''
//         }
//       }
//     })
//     .catch(e => console.log(e))
// }

run()
