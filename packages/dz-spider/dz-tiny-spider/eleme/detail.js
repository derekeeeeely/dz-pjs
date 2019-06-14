const Crawler = require('crawler')
const colors = require('colors/safe')
const axios = require('axios')
const { sqlquery } = require('../utils')

const lists = []
const spiders = []
let count = 0
let aproxys = []
const size = 2000

// 这个接口代理封得太快了...几十个请求就封了，难受

// wtf!
process.on('uncaughtException', (err) => {
  console.log('uncaughtException', err)
});

// 获取代理列表
const getProxys = () => {
  return axios.get('http://dev.kuaidaili.com/api/getproxy/?orderid=972646106788950&num=1000&b_pcchrome=1&b_pcie=1&b_pcff=1&b_iphone=1&protocol=2&method=2&an_an=1&an_ha=1&quality=0&sort=1&format=json&sep=1').then(res => {
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
      'X-Shard': `shopid=664925;loc=113.282229497534,23.138539868777`,
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_3_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15F5037c MicroMessenger/6.6.2 NetType/WIFI Language/en',
      'Host': 'mainsite-restapi.ele.me',
      'Referer': 'https://servicewechat.com/wxece3a9a4c82f58c9/154/page-frame.html',
    },
    method: 'GET',
    uri: `https://mainsite-restapi.ele.me/pizza/v1/restaurants/1411922?extras=%5B%22activities%22%5D&latitude=29.606781&longitude=119.058945&terminal=weapp`,
    proxy: `http://${e}`,
    // rateLimit: 100,
  }))
  pryCheckSpider.queue(queues)
}

const config = {
  maxConnections: 1000000,
  jQuery: false,
  callback(error, res, done) {
    if (error) {
      console.log(colors.red("ERROR"), '获取详情失败1')
    } else {
      const item = res.options.extra.item
      const index = res.options.extra.index
      let time = res.options.extra.time
      const proxy = res.options.proxy
      const detail = res.body ? JSON.parse(res.body) : {}
      if (detail && detail.info && detail.info.delivery_mode) {
        item.deliverType = detail.info.delivery_mode.text
        item.grid = `${detail.info.longitude}, ${detail.info.latitude}`
        console.log(`type is ${item.deliverType} ============ grid is ${item.grid}`)
        sqlquery(`update elemes set deliverType='${item.deliverType}',grid='${item.grid}' where id=${item.id}`).then((result) => {
          console.log(`切片为：${index} 商家: ${item.id} 配送方式 has changed, count is ${count++} ------------`)
          const next = index + (size * (++time))
          runNext(next, proxy, 0)
        }, (error) => {
          console.log(error)
        })
      } else {
        console.log('获取详情失败2')
        // const next = index + (size * (++time))
        runNext(index, proxy, 1)
      }
    }
  }
}

const start = () => {
  getProxys().then(() => {
    setTimeout(() => {
      sqlquery(`select * from elemes where deliverType='' order by monthly desc`).then(res => {
        for (let i = 0; i < res.length; i++) {
          lists.push(res[i])
        }
        for (let j = 0; j < size; j++) {
          spiders.push(new Crawler(config))
          const select = (Number((Math.random() * 1000).toFixed(0)) % aproxys.length)
          const lat = +(lists[j].grid.split(',')[0])
          const lgt = +(lists[j].grid.split(',')[1])
          const shopId = +lists[j].shopId
          spiders[j].queue({
            headers: {
              'X-Shard': `shopid=${shopId};loc=${lgt},${lat}`,
              'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_3_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15F5037c MicroMessenger/6.6.2 NetType/WIFI Language/en',
              'Host': 'mainsite-restapi.ele.me',
              'Referer': 'https://servicewechat.com/wxece3a9a4c82f58c9/154/page-frame.html',
            },
            method: 'GET',
            uri: `https://mainsite-restapi.ele.me/pizza/v1/restaurants/${shopId}?extras=%5B%22activities%22%5D&latitude=${lat}&longitude=${lgt}&terminal=weapp`,
            proxy: aproxys[select],
            // rateLimit: 200,
            extra: {
              item: lists[j],
              index: j,
              time: 0
            }
          })
        }
      })
    }, 10000);
  })
 }

const runNext = (next, proxy, retry) => {
  if (retry) {
    console.log(`====== proxy:${proxy}有问题，重试`)
    aproxys = aproxys.filter(e => e!==proxy)
    if (aproxys.length < 3) {
      getProxys().then(res => {
        goDetail(next)
      })
    }
    else {
      goDetail(next)
    }
  } else {
    // proxy可用，继续用
    goDetail(next, proxy)
  }
}

goDetail = (next, proxy) => {
  const item = lists[next]
  const lat = +(item.grid.split(',')[0])
  const lgt = +(item.grid.split(',')[1])
  const shopId = +item.shopId
  const select = (Number((Math.random() * 100).toFixed(0)) % aproxys.length)
  spiders[next%size].queue({
    headers: {
      'X-Shard': `shopid=${shopId};loc=${lgt},${lat}`,
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_3_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15F5037c MicroMessenger/6.6.2 NetType/WIFI Language/en',
      'Host': 'mainsite-restapi.ele.me',
      'Referer': 'https://servicewechat.com/wxece3a9a4c82f58c9/154/page-frame.html',
    },
    method: 'GET',
    uri: `https://mainsite-restapi.ele.me/pizza/v1/restaurants/${shopId}?extras=%5B%22activities%22%5D&latitude=${lat}&longitude=${lgt}&terminal=weapp`,
    // rateLimit: 200,
    proxy: proxy ? proxy : aproxys[select],
    extra: {
      item: item,
      index: (next % size),
      time: Math.floor(next / size),
    }
  })
}

start()