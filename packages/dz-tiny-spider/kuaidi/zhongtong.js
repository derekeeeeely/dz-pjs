const Crawler = require('crawler')
const colors = require('colors/safe')
const axios = require('axios')
const { sqlquery } = require('../utils')
const regions = require('./ztRegion')

const getCity = () => {
  const list = []
  regions.map(e => {
    e.children.map(e2 => {
      list.push({
        province: e.text,
        provinceId: e.value,
        city: e2.text,
        cityId: e2.value
      })
    })
  })
  return list
}

let aproxys = []

// const getProxy = () => {
//   return axios.get('http://dev.kdlapi.com/api/getproxy/?orderid=903189330917648&num=100&b_pcchrome=1&b_pcie=1&b_pcff=1&protocol=2&method=2&an_an=1&an_ha=1&quality=1&sort=1&format=json&sep=1').then(res => {
//     if (res.data) {
//       aproxys = res.data
//       console.log(aproxys)
//     }
//   }).catch(e => console.log(e))
// }

// 获取代理列表
const getProxys = () => {
  return axios.get('http://dev.kdlapi.com/api/getproxy/?orderid=903189330917648&num=100&b_pcchrome=1&b_pcie=1&b_pcff=1&protocol=2&method=2&an_an=1&an_ha=1&quality=1&sort=1&format=json&sep=1').then(res => {
    if (res.data && res.data.data) {
      // aproxys = []
      checkProxy(res.data.data.proxy_list)
    }
  }).catch(e => console.log(e))
}

// 检测代理可用的爬虫
const pryCheckSpider = new Crawler({
  maxConnections: 100000000,
  jQuery: false,
  callback(error, res, done) {
    if (error) {
      console.log(colors.red("ERROR"), 'proxy check failed')
    } else {
      if (res.body) {
        console.log(`代理： ${res.options.proxy} 可用`)
        aproxys.push(res.options.proxy)
      }
    }
  }
})

// 获取有效代理
const checkProxy = (prys) => {
  const queues = prys.map(e => ({
    headers: {
      'X-ZOP-NAME': 'siteDetailService',
      'Origin': 'http://www.zto.com',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36(KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36'
    },
    method: 'POST',
    form: {
      code: 22283
    },
    proxy: `http://${e}`,
    uri: 'https://hdgateway.zto.com/gateway.do',
  }))
  pryCheckSpider.queue(queues)
}

const ss = []

const ztSpider = new Crawler({
  callback(error, res, done) {
    if (error) {
      console.log(colors.red("ERROR"), "ztSpider error:", res.options.uri, error);
    } else {
      console.log(colors.green("SUCCESS"), `fetch ${res.options.uri} with city: ${res.options.form.province}-${res.options.form.city}`)
      const list = JSON.parse(res.body)
      const item = list.result.data
      if (item && item[0]) {
        ss.push(item[0].disNum)
        // console.log(item[0].list, '-=-=-=-=-=')
      }
      // console.log(list.result.data[0].disNum, '=========')
      // ss.push(list.result.items.length)

      console.log(ss.reduce((a, b) => a + b))
      if (item && item[0] && item[0].list) {
        item[0].list.map(e => {
          console.log(e)
          detailSpider.queue({
            headers: {
              'X-ZOP-NAME': 'siteDetailService',
              'Origin': 'http://www.zto.com',
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36(KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36'
            },
            method: 'POST',
            form: {
              code: e.code
            },
            uri: 'https://hdgateway.zto.com/Site_GetDetailByCode'
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
      console.log(colors.green("SUCCESS"), `fetch ${res.options.uri} with id: ${res.options.form.code}`)
      let detail = JSON.parse(res.body)
      detail = detail.result || {}

      console.log(detail, '================')
      const final = {
        company: detail.companyName,
        site: detail.name,
        code: detail.code,
        city: detail.city,
        principal: detail.manager || detail.master,
        address: `[${detail.province}-${detail.city}-${detail.district}] ${detail.address}`,
        phone: detail.managerMobile || detail.masterMobile,
        complainPhone: detail.outerPhone,
        areaIn: detail.dispatchRange,
        areaOut: detail.notDispatchRange,
        map: `${detail.baiduLongitude}, ${detail.baiduLatitude}`,
      }
      sqlquery("INSERT INTO zhongtong0718 SET ?", final).then((result) => {
        console.log(`insert into mysql ok, company is ${final.company}`)
      }, (error) => {
        console.log(error)
      })
    }
    done()
  }
})

const run = () => {
  const citys = getCity()
  const queue = citys.map((e, index) => ({
    headers: {
      'X-ZOP-NAME': 'siteListService',
      'Origin': 'http://www.zto.com',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36(KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36'
    },
    method: 'POST',
    form: {
      province: e.province,
      provinceId: e.provinceId,
      city: e.city,
      cityId: e.cityId,
      district: '',
      districtId: '',
      keyword: '',
      pageIndex: 1,
      pageSize: 1000
    },
    uri: 'https://hdgateway.zto.com/gateway.do',
    proxy: aproxys[index],
  }))
  ztSpider.queue(queue)
}

// 开始
const start = () => {
  getProxys().then(e => setTimeout(() => {
    run()
  }, 10000)).catch(err => console.log(err))
}

start()