const Crawler = require('crawler')
const colors = require('colors/safe')
// const axios = require('axios')
const { sqlquery } = require('../utils')

// 全国坐标范围
const XL = 73.6
const XH = 135.1
const YL = 17
const YH = 53.6

const spider = new Crawler({
  callback(error, res, done) {
    if (error) {
      console.log(colors.red("ERROR"), "spider error:", res.options.uri, error);
    } else {
      const list = JSON.parse(res.body)
      console.log(list.length, '===============')
      console.log(colors.green("SUCCESS"), `fetch ${res.options.uri} success`)
      const final = list.map(e => ({
        company: `${e.orgName}圆通`,
        site: `${e.orgName}圆通`,
        code: e.orgCode,
        city: e.orgProvince,
        principal: e.principalName,
        address: e.address,
        phone: e.principalPhone.trim(),
        complainPhone: e.complaintsPhone.trim(),
        areaIn: e.dispatchIn,
        areaOut: e.dispatchOut,
        map: e.addressPoint
      }))

      for (let i = 0; i < final.length; i++) {
        sqlquery("INSERT INTO yuantong0718 SET ?", final[i]).then((result) => {
          console.log(`insert into mysql ok, company is ${final[i].company}`)
        }, (error) => {
          // console.log(res.options.form.ci, res.options.form.cy)
          console.log(error)
        })
      }

      // sqlquery("INSERT INTO yuantong0718 SET ?", final).then((result) => {
      //   console.log(`insert into mysql ok, company is ${final.company}`)
      // }, (error) => {
      //   console.log(error)
      // })
    }
    done()
  }
})

const run = () => {
  const queue = {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/javascript, */*; q=0.01',
      'Accept-Encoding': 'gzip, deflate',
      'Accept-Language': 'zh-CN, zh; q=0.9, en; q=0.8',
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Cookie': 'JSESSIONID=EB9A0DB04B60456F797A9E1354560273',
      'Referer': 'http://116.228.70.238:8801/gisow/',
      'Origin': 'http://116.228.70.238:8801',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36'
    },
    form: {
      zoomSize: 13,
      platform: 'PointJuhe',
      juheParamType: 3,
      lblng: XL,
      rtlng: XH,
      lblat: YL,
      rtlat: YH
    },
    proxy: 'http://101.236.60.225:8866',
    uri: `http://116.228.70.238:8801/YTO_GPSITF_WEB/PlatformService?AppId=D7EFC29F0583C0E1E040010A9CCB1ED8&dbType=gisowConfig`,
  }
  spider.queue(queue)
}

run()