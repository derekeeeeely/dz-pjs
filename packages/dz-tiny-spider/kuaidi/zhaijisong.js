const Crawler = require('crawler')
const colors = require('colors/safe')
const axios = require('axios')
const qs = require('qs');
const { sqlquery } = require('./utils')

const headers = {
  'Accept': 'application/json, text/javascript, */*; q=0.01',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36',
  'Accept-Encoding': 'gzip, deflate',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
  'Cookie': 'clientlanguage=zh_CN; BIGipServerwww_pool=1132530186.17183.0000; UM_distinctid=1624cc108f8712-0319ad5d9b4d19-33637805-1fa400-1624cc108f9114d; JSESSIONID=5C0DAF4CFAC656B9E9F5BCE641101449; JSESSIONID=5C0DAF4CFAC656B9E9F5BCE641101449; CNZZDATA1256416327=684410530-1521705216-%7C1521716022',
  'Origin': 'http://www.zjs.com.cn'
}

const province = ["上海市", "云南省", "内蒙古自治区", "北京市", "吉林省", "四川省", "天津市", "宁夏回族自治区", "安徽省", "山东省", "山西省", "广东省", "广西壮族自治区", "新疆维吾尔自治区", "江苏省", "江西省", "河北省", "河南省", "浙江省", "海南省", "湖北省", "湖南省", "甘肃省", "福建省", "西藏自治区", "贵州省", "辽宁省", "重庆市", "陕西省", "青海省", "香港省", "黑龙江省"]

let hello = 0
let s = 0

const ztSpider = new Crawler({
  callback(error, res, done) {
    if (error) {
      console.log(colors.red("ERROR"), "ztSpider error:", res.options.uri, error);
    } else {
      console.log(colors.green("SUCCESS"), `fetch ${res.options.uri} with city: ${res.options.form.ci} and county: ${res.options.form.cy} `)
      const list = JSON.parse(res.body)
      hello += list.length
      console.log(hello)
      console.log(list.length)
      // let final = []
      // console.log(list.length)
      final = list.map(detail => ({
          company: detail.corptype || '',
          site: detail.unitname || '',
          code: detail.pk_corp || '',
          city: res.options.form.ci || '',
          principal: detail.linkman1 || '',
          address: detail.saleaddr || '',
          phone: detail.phone1 || '',
          areaIn: res.options.form.ain || '',
          areaOut: res.options.form.aout || '',
          map: `${detail.lng || ''}, ${detail.lat || ''}`,
      }))

      // console.log(final)
      for (let i = 0; i < final.length; i++) {
        sqlquery("INSERT INTO zhaijisong SET ?", final[i]).then((result) => {
          console.log(`insert into mysql ok, company is ${final[i].company}, count is ${s++}`)
        }, (error) => {
          console.log(res.options.form.ci, res.options.form.cy)
          console.log(error)
        })
      }
    }
    done()
  }
})

const getArea = (city, county) => {
  return axios.post('http://www.zjs.com.cn/area_data_list_by_county.jspx', qs.stringify({
    city: '',
    county: ''
  }), {
    headers: headers
  }).then(res => {
    return res.data
  }, rej => {
    console.log('error')
  })

}


const run = () => {
  getRegions((lls) => {
    console.log(lls.length)
    lls.map(e => {
      axios.post('http://www.zjs.com.cn/area_data_list_by_county.jspx', qs.stringify({
          city: e.city,
          county: e.county
        }), {
            headers: headers
          }).then( res => {
            const resp = res.data
            const queue = {
              uri: 'http://www.zjs.com.cn/company_category.jspx',
              method: 'POST',
              headers: headers,
              form: {
                region: e.code,
                address: '',
                ci: e.city,
                cy: e.county,
                ain: resp.vinservregion || '',
                aout: resp.voutservregion || ''
              }
            }
            ztSpider.queue(queue)
          }, rej => {
            console.log('get area error')
            const queue = {
              uri: 'http://www.zjs.com.cn/company_category.jspx',
              method: 'POST',
              headers: headers,
              form: {
                region: e.code,
                address: '',
                ci: e.city,
                cy: e.county,
                ain: '',
                aout: ''
              }
            }
            ztSpider.queue(queue)
          })

    })
  })
}

const getRegions = (cb) => {
  Promise.all(province.map(prov => {
    return axios.post('http://www.zjs.com.cn/area_data_citylist.jspx', qs.stringify({
      prov: prov
    }), {
        headers: headers
      }).then(res => {
        return res.data
      }, err => {
        console.log('error')
      })
  })).then(cities => {
    const cs = Array.prototype.concat.apply([], cities)
    Promise.all(cs.map(city => {
      return axios.post('http://www.zjs.com.cn/area_data_countylist.jspx', qs.stringify({
        city: city.city
      }), {
        headers: headers
      }).then(res1 => {
        return res1.data.map(e => ({
          city: city.city,
          county: e.county
        }))
      }, err => {
        console.log('error')
      })
    })).then(countys => {
      const cty = Array.prototype.concat.apply([], countys)
      return cty
    }).then(ctys => {
      Promise.all(ctys.map(ele => {
        return axios.post('http://www.zjs.com.cn/area_data_list_by_county.jspx', qs.stringify(ele), {
          headers: headers
        }).then(res2 => {
          return {
            city: ele.city,
            county: ele.county,
            code: res2.data.pk_region
          }
        })
      })).then(codes => {
        cb(codes)
        return codes
      })
    })
  }, rej => {
    console.log('error')
  })

}


run()