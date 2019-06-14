const Crawler = require('crawler')
const colors = require('colors/safe')
const axios = require('axios')
const { sqlquery } = require('../utils')



let aproxys = []
let spiders = []
let tasks = []
let count = 0

// wtf!
process.on('uncaughtException', (err) => {
  console.log('uncaughtException', err)
});


// 获取代理列表
const getProxys = () => {
  return axios.get('http://dev.kdlapi.com/api/getproxy/?orderid=984095860421194&num=100&b_pcchrome=1&b_pcie=1&b_pcff=1&protocol=2&method=2&an_an=1&an_ha=1&quality=1&sort=2&format=json&sep=1').then(res => {
    if (res.data && res.data.data) {
      // aproxys = []
      checkProxy(res.data.data.proxy_list)
    }
  }).catch(e => console.log(e))
}

// 地址转换城市信息
const geocoder = (address) => {
  return axios.get(`http://restapi.amap.com/v3/geocode/geo?key=897aa2d56250ab7c34ff890cb0f24cc8&address=${encodeURIComponent(address)}`)
    .then(res => {
      const resp = res.data
      if (resp.status == 1 && resp.count >= 1 && resp.geocodes) {
        return {
          city: resp.geocodes[0].city,
          province: resp.geocodes[0].province
        }
      } else {
        return {
          city: '',
          province: ''
        }
      }
    })
    .catch(e => console.log(e))
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
      'X-Shard': `loc=${119},${29}`,
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_3_1 like Mac OS X) AppleWebKit/604.4.7 (KHTML, like Gecko) Mobile/15C202 MicroMessenger/6.6.1 NetType/4G Language/zh_CN'
    },
    method: 'GET',
    uri: `https://mainsite-restapi.ele.me/pizza/v3/restaurants?offset=0&limit=30&latitude=${29}&longitude=${119}&extras=%5B%22activities%22%5D&extra_filters=home&keyword=&order_by=0&terminal=weapp`,
    proxy: `http://${e}`,
  }))
  pryCheckSpider.queue(queues)
}

const config = {
  maxConnections: 1000,
  jQuery: false,
  callback(error, res, done) {
    let offset = res.options.extra.offset
    let index = res.options.extra.index
    let id = res.options.extra.id
    let uri = res.options.uri

    if (error) {

    } else {
      if (!res.body) {
        sqlquery("INSERT INTO elemeLog1030 SET ?", { uri: uri, status: 0 }).then((result) => {
          console.log(colors.red("ERROR"), `失败，已加入日志表，url为：${uri} `, error);
        }, (err) => {
          console.log(err)
        })
      }
      const list = res.body ? JSON.parse(res.body) : {}
      if (list && list.items && list.items.length) {
        offset += list.items.length
        const final = list.items.map(item => {
          const restaurant = item.restaurant
          return {
            name: restaurant.name || '',
            address: restaurant.address || '',
            phone: restaurant.phone || '',
            monthly: restaurant.recent_order_num || 0,
            deliverType: restaurant.delivery_mode ? restaurant.delivery_mode.text : '',
            deliverFee: restaurant.piecewise_agent_fee ? restaurant.piecewise_agent_fee.tips : '',
            deliverTime: restaurant.order_lead_time || 0,
            period: restaurant.opening_hours ? restaurant.opening_hours.join(',') : '',
            shopId: restaurant.id,
            grid: ''
          }
        })


        // 转换城市，插入数据库，计数
        for (let i = 0; i < final.length; i++) {
          // console.log(JSON.stringify(final[i]))
          sqlquery(`select * from eleme1031 where shopId=${+final[i].shopId}`).then(re => {
            if (!re.length) {
              // console.log(re)
              geocoder(final[i].address).then(cp => {
                final[i].city = cp.city
                final[i].province = cp.province
                // console.log(final[i])
                sqlquery("INSERT INTO eleme1031 SET ?", final[i]).then((result) => {
                  console.log(colors.green("SUCCESS"))
                }, (error) => {
                  console.log(error)
                })
                // left.js不再做retry和log标记...
                sqlquery(`update elemeLog1030 set status=1 where id=${id}`).then((result) => {
                  console.log(`id: ${id} status changed`)
                }, (error) => {
                  console.log(error)
                })

              }).catch(e => console.log(e))

            }
          })
        }
        runNext(index, offset)
      }
    }
  }
}

const runNext = (index, offset) => {
  const i = (Number((Math.random() * 100).toFixed(0)) % aproxys.length)
  console.log(`选取随机proxy：${aproxys[i]}`)
  const block = tasks[index]
  const queue = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_3_1 like Mac OS X) AppleWebKit/604.4.7 (KHTML, like Gecko) Mobile/15C202 MicroMessenger/6.6.1 NetType/4G Language/zh_CN'
    },
    method: 'GET',
    uri: `https://mainsite-restapi.ele.me/pizza/v3/restaurants?offset=${offset}&limit=30&${block.uri.split('&')[2]}&${block.uri.split('&')[3]}&extras=%5B%22activities%22%5D&extra_filters=home&keyword=&order_by=0&terminal=weapp`,
    proxy: aproxys[i],
    extra: {
      index: index,
      offset: offset,
      id: block.id
    }
  }
  spiders[index].queue(queue)
}

run = () => {
  sqlquery("select * from elemeLog1030 where status=0").then((result) => {
    for (let i = 0; i < result.length; i++) {
      const pr = (i % aproxys.length)
      tasks.push(result[i])
      spiders.push(new Crawler(config))
      const queue = {
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_3_1 like Mac OS X) AppleWebKit/604.4.7 (KHTML, like Gecko) Mobile/15C202 MicroMessenger/6.6.1 NetType/4G Language/zh_CN'
        },
        method: 'GET',
        uri: result[i].uri,
        proxy: aproxys[pr],
        extra: {
          index: i,
          offset: +(result[i].uri.split('?offset=')[1][0]),
          id: result[i].id
        }
      }
      spiders[i].queue(queue)
    }
  }, (err) => {
    console.log(err)
  })
}

const start = () => {
  getProxys().then(e => setTimeout(() => {
    run()
  }, 10000)).catch(err => console.log(err))
}

start()