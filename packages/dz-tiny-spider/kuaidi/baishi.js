// const Crawler = require('crawler')
const colors = require('colors/safe')
// const cheerio = require('cheerio')
const axios = require('axios')
const { sqlquery } = require('../utils')

// const baishiSpider = new Crawler({
//   callback(error, res, done) {
//     if (error) {
//       console.log(colors.red("ERROR"), "baishiSpider error:", res.options.uri, error);
//     } else {
//       console.log(colors.green("SUCCESS"), `fetch ${res.options.uri} success` )
//       const baishiDetail = JSON.parse(res.body)
//       if (baishiDetail && baishiDetail.data) {
//         let final = []
//         final = baishiDetail.data.map(detail => ({
//           company: detail.name,
//           site: detail.name,
//           code: detail.id,
//           city: detail.city,
//           principal: detail.owner,
//           address: '',
//           phone: detail.phone,
//           complainPhone: '',
//           areaIn: detail.range,
//           areaOut: detail.norange,
//           map: '',
//           type: 'baishi'
//         }))
//         if (final.length) {
//           sqlquery("INSERT INTO kuaidi SET ?", final).then((result) => {
//             console.log(`insert into mysql ok`)
//           }, (error) => {
//             console.log(error)
//           })
//         }
//       }
//     }
//     done()
//   }
// })

const cityList = ["北京", "天津", "河北省", "山西省", "内蒙古自治区", "辽宁省", "吉林省", "黑龙江省", "上海", "江苏省", "浙江省", "安徽省", "福建省", "江西省", "山东省", "河南省", "湖北省", "湖南省", "广东省", "广西壮族自治区", "海南省", "重庆", "四川省", "贵州省", "云南省", "西藏自治区", "陕西省", "甘肃省", "青海省", "宁夏回族自治区", "新疆维吾尔自治区", "台湾省"]

// const run = () => {
//   const queue = []
//   cityList.map((e) => {
//     queue.push({
//       method: 'POST',
//       headers: {
//         'Accept': '*/*',
//         'Accept-Encoding': 'gzip, deflate',
//         'Accept-Language': 'zh-CN, zh; q=0.9, en; q=0.8',
//         'Connection': 'keep-alive',
//         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
//         'Cookie': 'Hm_lvt_8fd193f17ae8acf2be1a1cfc65323057=1521609585;Hm_lpvt_8fd193f17ae8acf2be1a1cfc65323057=1521609585; UM_distinctid=16246ffb1566f3-0771a62544f403-33637805-1fa400-16246ffb157752;CNZZDATA3653922=cnzz_eid%3D1899766945-1521608611-%26ntime%3D1521608611; SERVERID=261ad5bf7c627fef7314106f3b3a693d|1521623044|1521623043',
//         'Origin': 'http://www.800bestex.com',
//         'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36'
//       },
//       form: {
//         province: e,
//         city: '',
//         county: '',
//         query: '',
//         appId: 'HTWeb'
//       },
//       uri: 'http://www.800bestex.com/htwebapi/site/query'
//     })
//   })
//   baishiSpider.queue(queue)
// }
let s = 0

const run1 = () => {
  const final = []
  for (let i = 0; i < cityList.length; i++) {
    axios.post(`http://www.800bestex.com/htwebapi/site/query`, {
      province: cityList[i],
      city: '',
      county: '',
      query: '',
      appId: 'HTWeb'
    })
      .then(res => {
        const resp = res.data
        if (resp && resp.data) {
          // console.log(cityList[i], resp.data.length, resp.data, '======')
          s += resp.data.length
          console.log(s)
          resp.data.map(detail => {
            final.push({
              company: detail.name,
              site: detail.name,
              code: detail.id,
              city: `${detail.province} ${detail.city}`,
              principal: detail.owner,
              address: '',
              phone: detail.phone,
              complainPhone: '',
              areaIn: detail.range,
              areaOut: detail.norange,
              map: '',
            })
          })
        }
      })
  }
  setTimeout(() => {
    for (let i = 0; i < final.length; i++) {
      sqlquery("INSERT INTO baishi0718 SET ?", final[i]).then((result) => {
        console.log(`insert into mysql ok, company is ${final[i].company}`)
      }, (error) => {
        console.log(error)
      })
    }
  }, 30000)
}

run1()
