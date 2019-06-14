const Crawler = require('crawler')
const colors = require('colors/safe')
const axios = require('axios')
const { sqlquery } = require('./utils')

const cityList = [{ "name": "北京市", "code": "110000", total: 1338 }, { "name": "天津市", "code": "120000", total: 200 }, { "name": "河北省", "code": "130000", total: 1102 }, { "name": "山西省", "code": "140000", total: 1316 }, { "name": "内蒙古自治区", "code": "150000", total: 230 }, { "name": "辽宁省", "code": "210000", total: 1013 }, { "name": "吉林省", "code": "220000", total: 550 }, { "name": "黑龙江省", "code": "230000", total: 848 }, { "name": "上海市", "code": "310000", total: 1024 }, { "name": "江苏省", "code": "320000", total: 2565 }, { "name": "浙江省", "code": "330000", total: 2068 }, { "name": "安徽省", "code": "340000", total: 991 }, { "name": "福建省", "code": "350000", total: 991 }, { "name": "江西省", "code": "360000", total: 899 }, { "name": "山东省", "code": "370000", total: 1386 }, { "name": "河南省", "code": "410000", total: 1804 }, { "name": "湖北省", "code": "420000", total: 1109 }, { "name": "湖南省", "code": "430000", total: 865 }, { "name": "广东省", "code": "440000", total: 3615 }, { "name": "广西壮族自治区", "code": "450000", total: 656 }, { "name": "海南省", "code": "460000", total: 158 }, { "name": "重庆市", "code": "500000", total: 483 }, { "name": "四川省", "code": "510000", total: 1284 }, { "name": "贵州省", "code": "520000", total: 685 }, { "name": "云南省", "code": "530000", total: 648 }, { "name": "西藏自治区", "code": "540000", total: 50 }, { "name": "陕西省", "code": "610000", total: 1134 }, { "name": "甘肃省", "code": "620000", total: 385 }, { "name": "青海省", "code": "630000", total: 51 }, { "name": "宁夏回族自治区", "code": "640000", total: 113 }, { "name": "新疆维吾尔自治区", "code": "650000", total: 294 }, { "name": "台湾省", "code": "710000", total: 4 }, { "name": "香港特别行政区", "code": "810000", total: 61 }, { "name": "澳门特别行政区", "code": "820000", total: 1 }]

const tiantianSpider = new Crawler({
  callback(error, res, done) {
    if (error) {
      console.log(colors.red("ERROR"), "tiantianSpider error:", res.options.uri, error);
    } else {
      console.log(colors.green("SUCCESS"), `fetch ${res.options.uri}`)
      // console.log(res.body)
      const list = JSON.parse(res.body)
      list.map(e => {
        let final
        geocoder(e.networkaddress).then(res1 => {
          final = {
            company: e.networkname,
            site: e.networkname,
            code: e.networkno,
            city: e.countyno,
            principal: e.personincharge,
            address: `${e.countyno} ${e.networkaddress}`,
            phone: e.querytel,
            complainPhone: e.businesstel,
            areaIn: e.deliveryrange,
            areaOut: e.nodeliveryrange,
            map: res1,
          }
          sqlquery("INSERT INTO tiantian SET ?", final).then((result) => {
            console.log(`insert into mysql ok, company is ${final.company}`)
          }, (error) => {
            console.log(error)
          })
        }, res2 => {
          final = {
            company: e.networkname,
            site: e.networkname,
            code: e.networkno,
            city: e.countyno,
            principal: e.personincharge,
            address: `${e.countyno} ${e.networkaddress}`,
            phone: e.querytel,
            complainPhone: e.businesstel,
            areaIn: e.deliveryrange,
            areaOut: e.nodeliveryrange,
            map: '',
          }
          sqlquery("INSERT INTO tiantian SET ?", final).then((result) => {
            console.log(`insert into mysql ok, company is ${final.company}`)
          }, (error) => {
            console.log(error)
          })
        })
      })
    }
    done()
  }
})

const geocoder = (address) => {
  return axios.get(`http://restapi.amap.com/v3/geocode/geo?key=87453539f02a65cd6585210fa2e64dc9&address=${encodeURIComponent(address)}`)
    .then(res => {
      const resp = res.data
      if (resp.status == 1 && resp.count >= 1 && resp.geocodes) {
        return resp.geocodes[0].location
      } else {
        console.log(resp)
        return ''
      }
    })
}

const run = () => {
  const queue = []
  cityList.map(e => {
    queue.push({
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Cookie': 'JSESSIONID=B0D18698D4E2EF3E092C226E57AD2459',
        'Origin': 'http://www.ttkdex.com',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36'
      },
      uri: 'http://www.ttkdex.com/netWork/netWorkAction!searchNetWorkByCounty.action',
      form: {
        county: e.name
      }
    })
  })
  tiantianSpider.queue(queue)
}

run()