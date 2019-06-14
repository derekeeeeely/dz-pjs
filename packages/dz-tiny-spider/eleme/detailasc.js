const Crawler = require('crawler')
const colors = require('colors/safe')
const axios = require('axios')
const { sqlquery } = require('../utils')

const queue = []
let count = 0
let aproxys = ['http://111.67.65.9:8080']

// wtf!
process.on('uncaughtException', (err) => {
  console.log('uncaughtException', err)
});

// 获取代理列表
const getProxys = () => {
  return axios.get('http://dev.kuaidaili.com/api/getproxy/?orderid=972646106788950&num=100&b_pcchrome=1&b_pcie=1&b_pcff=1&b_iphone=1&protocol=2&method=2&an_an=1&an_ha=1&quality=1&sort=1&format=json&sep=1').then(res => {
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
      'X-Shard': `shopid=1411922;loc=119.058945,29.606781`,
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15F5037c MicroMessenger/6.6.1 NetType/WIFI Language/en',
      'Host': 'mainsite-restapi.ele.me',
      'Referer': 'https://servicewechat.com/wxece3a9a4c82f58c9/154/page-frame.html',
    },
    method: 'GET',
    uri: `https://mainsite-restapi.ele.me/pizza/v1/restaurants/1411922?extras=%5B%22activities%22%5D&latitude=29.606781&longitude=119.058945&terminal=weapp`,
    proxy: `http://${e}`,
  }))
  pryCheckSpider.queue(queues)
}

const start = () => {
  getProxys().then(() => {
    setTimeout(() => {
      sqlquery(`select * from elemes where deliverType=''`).then(res => {
        for (let i = 0; i < res.length; i++) {
          const lat = +(res[i].grid.split(',')[0])
          const lgt = +(res[i].grid.split(',')[1])
          queue.push({
            headers: {
              'X-Shard': `shopid=${res[i].shopId};loc=${lgt},${lat}`,
              'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15F5037c MicroMessenger/6.6.1 NetType/WIFI Language/en',
              'Host': 'mainsite-restapi.ele.me',
              'Referer': 'https://servicewechat.com/wxece3a9a4c82f58c9/154/page-frame.html',
            },
            method: 'GET',
            uri: `https://mainsite-restapi.ele.me/pizza/v1/restaurants/${res[i].shopId}?extras=%5B%22activities%22%5D&latitude=${lat}&longitude=${lgt}&terminal=weapp`,
            extra: {
              item: res[i]
            }
          })
        }
        queue[0].proxy = aproxys[0]
        spider.queue(queue[0])
        // getProxys().then(() => {
        //   // const select =
        //   queue.map(e => ({
        //     ...e,
        //     proxy: aproxys[0]
        //   }))
        //   spider.queue(queue)
        // })
      })
    }, 10000);
  })
 }
const runNext = (proxy) => {
  if (proxy) {
    console.log(`====== proxy:${proxy}有问题，重试`)
    aproxys = aproxys.filter(e => e!==proxy)
    if (aproxys.length < 3) {
      getProxys().then(e => {
        queue[0].proxy = aproxys[0]
        spider.queue(queue[0])
      })
    }
    else {
      queue[0].proxy = aproxys[0]
      spider.queue(queue[0])
    }
  } else {
    queue[0].proxy = aproxys[0]
    spider.queue(queue[0])
  }
}

const spider = new Crawler({
  maxConnections: 1000000,
  jQuery: false,
  callback(error, res, done) {
    if (error) {
      console.log(colors.red("ERROR"), '获取详情失败1')
    } else {
      const item = res.options.extra.item
      const proxy = res.options.proxy
      const detail = res.body ? JSON.parse(res.body) : {}
      if (detail && detail.info && detail.info.delivery_mode) {
        item.deliverType = detail.info.delivery_mode.text
        item.grid = `${detail.info.longitude}, ${detail.info.latitude}`
        console.log(`type is ${item.deliverType} ============ grid is ${item.grid}`)
        sqlquery(`update elemes set deliverType='${item.deliverType}',grid='${item.grid}' where id=${item.id}`).then((result) => {
          console.log(`商家: ${item.id} 配送方式 has changed, count is ${count++} ------------`)
          queue.shift()
          runNext()
        }, (error) => {
          console.log(error)
        })
      } else {
        console.log(colors.red("ERROR"), '获取详情失败2')
        runNext(proxy)
      }
    }
  }
})

start()