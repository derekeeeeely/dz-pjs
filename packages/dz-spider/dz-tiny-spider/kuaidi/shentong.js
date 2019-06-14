const Crawler = require('crawler')
const colors = require('colors/safe')
const axios = require('axios')
const { sqlquery } = require('./utils')

const cityList = [{ "name": "北京市", "code": "110000", total: 1338 }, { "name": "天津市", "code": "120000", total: 200 }, { "name": "河北省", "code": "130000", total: 1102 }, { "name": "山西省", "code": "140000", total: 1316 }, { "name": "内蒙古自治区", "code": "150000", total: 230 }, { "name": "辽宁省", "code": "210000", total: 1013 }, { "name": "吉林省", "code": "220000", total: 550 }, { "name": "黑龙江省", "code": "230000", total: 848 }, { "name": "上海市", "code": "310000", total: 1024 }, { "name": "江苏省", "code": "320000", total: 2565 }, { "name": "浙江省", "code": "330000", total: 2068 }, { "name": "安徽省", "code": "340000", total: 991 }, { "name": "福建省", "code": "350000", total: 991 }, { "name": "江西省", "code": "360000", total: 899 }, { "name": "山东省", "code": "370000", total: 1386 }, { "name": "河南省", "code": "410000", total: 1804 }, { "name": "湖北省", "code": "420000", total: 1109 }, { "name": "湖南省", "code": "430000", total: 865 }, { "name": "广东省", "code": "440000", total: 3615 }, { "name": "广西壮族自治区", "code": "450000", total: 656 }, { "name": "海南省", "code": "460000", total: 158 }, { "name": "重庆市", "code": "500000", total: 483 }, { "name": "四川省", "code": "510000", total: 1284 }, { "name": "贵州省", "code": "520000", total: 685 }, { "name": "云南省", "code": "530000", total: 648 }, { "name": "西藏自治区", "code": "540000", total: 50 }, { "name": "陕西省", "code": "610000", total: 1134 }, { "name": "甘肃省", "code": "620000", total: 385 }, { "name": "青海省", "code": "630000", total: 51 }, { "name": "宁夏回族自治区", "code": "640000", total: 113 }, { "name": "新疆维吾尔自治区", "code": "650000", total: 294 }]

const shentongSpider = new Crawler({
  callback(error, res, done) {
    if (error) {
      console.log(colors.red("ERROR"), "shentongSpider error:", res.options.uri, error);
    } else {
      console.log(colors.green("SUCCESS"), `fetch ${res.options.uri}`)
      const list = JSON.parse(res.body)
      if (list.Data) {
        list.Data.map(e => {
          detailSpider.queue({
            uri: `http://www.sto.cn/Site/GetOrganizeByCode?Code=${e.Code}`
          })
        })
      }
    }
    done()
  }
})

const detailSpider = new Crawler({
  callback(error, res, done) {
    if (error) {
      console.log(colors.red("ERROR"), "detailSpider error:", res.options.uri, error);
    } else {
      console.log(colors.green("SUCCESS"), `fetch ${res.options.uri}`)
      const detail = JSON.parse(res.body).Data
      let final
      geocoder(detail.Address).then(res1 => {
        final = {
          company: detail.FullName,
          site: detail.StandardName,
          code: detail.Code,
          city: `${detail.Province} ${detail.City}`,
          principal: detail.Manager,
          address: `${detail.Province} ${detail.City} ${detail.District} ${detail.Address}`,
          phone: `${detail.ServiceManagerPhone}${detail.ServiceManager}`,
          complainPhone: detail.SiteTelephone,
          areaIn: detail.DispatchRange,
          areaOut: detail.NotDispatchRange,
          map: res1,
        }
        sqlquery("INSERT INTO shentong SET ?", final).then((result) => {
          console.log(`insert into mysql ok, company is ${final.company}`)
        }, (error) => {
          console.log(error)
        })
      }, res2 => {
        final = {
          company: detail.FullName,
          site: detail.StandardName,
          code: detail.Code,
          city: `${detail.Province} ${detail.City}`,
          principal: detail.Manager,
          address: `${detail.Province} ${detail.City} ${detail.District} ${detail.Address}`,
          phone: `${detail.ServiceManagerPhone}${detail.ServiceManager}`,
          complainPhone: detail.SiteTelephone,
          areaIn: detail.DispatchRange,
          areaOut: detail.NotDispatchRange,
          map: '',
        }
        sqlquery("INSERT INTO shentong SET ?", final).then((result) => {
          console.log(`insert into mysql ok, company is ${final.company}`)
        }, (error) => {
          console.log(error)
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
      uri: 'http://www.sto.cn/Site/GetOranizeByAreas',
      form: {
        provinceId: e.code,
        from: 0,
        size: 1000
      }
    })
  })
  shentongSpider.queue(queue)
}

run()