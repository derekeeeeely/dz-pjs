const Crawler = require('crawler')
const colors = require('colors/safe')
const axios = require('axios')
const { sqlquery } = require('./utils')

const regions = require('./sfRegions')['regions']
const locations = require('./sfRegions')['locations']

const getRegions = () => {
  return axios.get('http://www.sf-express.com/sf-service-owf-web/service/region/A000086000/subRegions?level=-1&lang=sc&region=cn&translate=').then(res => {
    const resp = res.data
    Promise.all(resp.map(_p => {
      return axios.get(`http://www.sf-express.com/sf-service-owf-web/service/region/${_p.code}/subRegions?level=2&lang=sc&region=cn&translate=`).then(res1 => {
        const resp1 = res1.data
        return resp1.map(e => ({
          province: _p.code,
          provinceName: _p.name,
          city: e.code,
          cityName: e.name
        }))
      })
    })).then(r => {
      const cities = Array.prototype.concat.apply([], r)
      return cities
      const final = {
        value: JSON.stringify(cities)
      }
      sqlquery("INSERT INTO test SET ?", final).then((result) => {
        console.log(`insert into mysql ok,`)
      }, (error) => {
        console.log(error)
      })
    }).then(c => {
      Promise.all(c.map(_c => {
        return axios.get(`http://www.sf-express.com/sf-service-owf-web/service/region/${_c.city}/subRegions?level=3&lang=sc&region=cn&translate=`).then(res2 => {
          const resp2 = res2.data
          return resp2.map(e => ({
            province: _c.province,
            provinceName: _c.provinceName,
            city: _c.city,
            cityName: _c.cityName,
            county: e.code,
            countyName: e.name
          }))
        })
      })).then(cy => {
        const countys = Array.prototype.concat.apply([], cy)
        const final = {
          value: JSON.stringify(countys)
        }
        sqlquery("INSERT INTO test SET ?", final).then((result) => {
          console.log(`insert into mysql ok,`)
        }, (error) => {
          console.log(error)
        })
      })
    })
  })
}

const getLocation = () => {
  let a = 0
  let lf = []
  let rg = []
  for (let i = 0; i < 2700; i++) {
    lf.push(regions[i])
  }
  for (let i = 2700; i < regions.length; i++) {
    rg.push(regions[i])
  }
  return Promise.all(rg.map(e => {
    console.log(e)
    return axios.get(`http://restapi.amap.com/v3/geocode/geo?key=87453539f02a65cd6585210fa2e64dc9&address=${encodeURIComponent(e.name)}`).then(r => {
      const resp = r.data
      a++
      console.log(a)
      if (resp.status == 1 && resp.count >= 1 && resp.geocodes) {
        return {
          value: resp.geocodes[0].location,
          code: e.code
        }
      } else {
        console.log(resp)
        return {
          value: '',
          code: e.code
        }
      }
    }, rj => {
      console.log('get location error', rj, a)
    })
  })).then(_lo => {
    console.log(_lo)
    const final = {
      value: JSON.stringify(_lo.map(e => ({
        longitude: e.value.split(',')[0],
        latitude: e.value.split(',')[1],
        code: e.code
      })))
    }
    sqlquery("INSERT INTO test SET ?", final).then((result) => {
      console.log(`insert into mysql ok,`)
    }, (error) => {
      console.log(error)
    })
  })
}

const getLocationFromDb = () => {
  sqlquery("select * from test where id > 29926").then(res => {
    console.log(res.map(e => JSON.parse(e.value)))
  })
}

let s = 0
let l = 0

const shunfengSpider = new Crawler({
  callback(error, res, done) {
    if (error) {
      console.log(colors.red("ERROR"), "shunfengSpider error:", res.options.uri, error);
    } else {
      console.log(colors.green("SUCCESS"), `fetch ${res.options.uri}`)
      console.log(`count is ${l++}`)
      const list = JSON.parse(res.body)
      list.map(detail => {
        let final
        final = {
          site: detail.name || '',
          code: detail.deptCode || '',
          city: res.options.extra.cityName || '',
          principal: detail.linkman || '',
          address: detail.address || '',
          phone: detail.tel || '',
          areaIn: res.options.extra.areaIn,
          areaOut: res.options.extra.areaOut,
          map: `${res.options.extra.longitude}, ${res.options.extra.latitude}`,
          type: detail.storeType || ''
        }
          // sqlquery('select code from shunfeng').then(re => {
          //   if (!~(re.map(e => e.code).indexOf(final.code))) {
              sqlquery("INSERT INTO shunfeng SET ?", final).then((result) => {
                console.log(`insert into mysql ok, site is ${final.site}, code is ${final.code}, count is ${s++}`)
              }, (error) => {
                console.log(res.options.form.ci, res.options.form.cy)
                console.log(error)
              })
          //   }
          // })
        })
    }
    done()
  }
})

const run = () => {
  // getRegions()
  // getLocation()
  let lf = []
  let rg = []
  for (let i = 0; i < 1300; i++) {
    lf.push(locations[i])
  }
  for (let i = 4600; i < locations.length; i++) {
    rg.push(locations[i])
  }
  rg.map(e => {
    axios.get(`http://www.sf-express.com/sf-service-owf-web/service/region/${e.code}/range?lang=sc&region=cn&translate=`).then(r => {
      const rd = r.data
      const cityName = regions.find(e1 => e1.code === e.code)['name']
      const queue = {
        uri: `http://www.sf-express.com/sf-service-owf-web/service/store?lang=sc&region=cn&translate=&longitude=${e.longitude}&latitude=${e.latitude}&range=3000.0`,
        method: 'get',
        extra: {
          areaIn: (rd && rd.normalRegions) ? rd.normalRegions.map(_ => _.name).join(',') : '',
          areaOut: (rd && rd.abnormalRegions) ? rd.abnormalRegions.map(_ => _.name).join(',') : '',
          latitude: e.latitude,
          longitude: e.longitude,
          cityName: cityName
        },
        headers: {
          'Connection': 'keep-alive',
          'Accept': 'application/json, text/javascript, */*; q=0.01',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36',
          'Accept-Encoding': 'gzip, deflate',
          "Accept-Language": 'zh-CN,zh;q=0.9,en;q=0.8',
          'Cookie': 'Hm_lvt_32464c62d48217432782c817b1ae58ce=1521777806; Hm_lpvt_32464c62d48217432782c817b1ae58ce=1521777809',
          'Host': 'www.sf-express.com'
        },
        // rateLimit: 100
      }
      shunfengSpider.queue(queue)
    }, rj => {
      const cityName = regions.find(e1 => e1.code === e.code)['name']
      const queue = {
        uri: `http://www.sf-express.com/sf-service-owf-web/service/store?lang=sc&region=cn&translate=&longitude=${e.longitude}&latitude=${e.latitude}&range=3000.0`,
        method: 'get',
        extra: {
          areaIn: '',
          areaOut: '',
          latitude: e.latitude,
          longitude: e.longitude,
          cityName: cityName
        },
        headers: {
          'Connection': 'keep-alive',
          'Accept': 'application/json, text/javascript, */*; q=0.01',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36',
          'Accept-Encoding': 'gzip, deflate',
          "Accept-Language": 'zh-CN,zh;q=0.9,en;q=0.8',
          'Cookie': 'Hm_lvt_32464c62d48217432782c817b1ae58ce=1521774988; Hm_lpvt_32464c62d48217432782c817b1ae58ce=1521774988',
          'Host': 'www.sf-express.com'
        },
        // rateLimit: 100
      }
      shunfengSpider.queue(queue)
    })
  })

}

// run()

getIds = () => {
  sqlquery(`select min(id) as d, site from shunfeng where address='' group by site`).then(res => {
    const ids = {
      value: res.map(el => el.d).join(',')
    }
    sqlquery("INSERT INTO test SET ?", ids).then((result) => {
      console.log(`insert into mysql ok,`)
    }, (error) => {
      console.log(error)
    })

  })
}


getIds()
