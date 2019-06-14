const Crawler = require('crawler')
const colors = require('colors/safe')
const axios = require('axios')
const { sqlquery } = require('../utils')


// 全国坐标范围
const quanguo = {
  XL: 73.6,
  XH: 135.1,
  YL: 17,
  YH: 53.6,
}
// 杭州市坐标范围
const hangzhou = {
  XL: 118.32,
  XH: 120.73,
  YL: 29.18,
  YH: 30.58,
}
// 北京
const beijing = {
  XL: 115.40,
  XH: 117.53,
  YL: 39.43,
  YH: 41.07,
}
// 上海坐标范围
const shanghai = {
  XL: 120.85,
  XH: 122.0,
  YL: 30.68,
  YH: 31.89,
}
// 深圳
const shenzhen = {
  XL: 113.5,
  XH: 114.7,
  YL: 22.4,
  YH: 22.9,
}
// 广州
const guangzhou = {
  XL: 112.9,
  XH: 114.1,
  YL: 22.5,
  YH: 23.96,
}


// 南京
const nanjing = {
  XL: 118.34,
  XH: 119.26,
  YL: 31.22,
  YH: 32.63,
}

// 成都
const chengdu = {
  XL: 102.97,
  XH: 104.90,
  YL: 30.09,
  YH: 31.45,
}

// 武汉
const wuhan = {
  XL: 113.69,
  XH: 115.09,
  YL: 29.95,
  YH: 31.37,
}

// 苏州
const suzhou = {
  XL: 120.18,
  XH: 121.35,
  YL: 30.75,
  YH: 32.03,
}

// 温州
const wenzhou = {
  XL: 119.61,
  XH: 121.28,
  YL: 27.11,
  YH: 28.64,
}


// 沈阳
const shenyang = {
  YL: 41.17,
  YH: 43.06,
  XL: 122.39,
  XH: 123.84
}


// 步长
const step = 0.02
// 网格划分大小
const size = 30

let shopLists = []
const allList = []
const spiders = []
let aproxys = []
let count = 0
let doneCount = 0
let notFound = false

// wtf!
process.on('uncaughtException', (err) => {
  console.log('uncaughtException', err)
});

// 生成网格
const getBlocks = (size, places, amount) => {
  const blks = []

  places.map((place, index) => {
    const { YH, YL, XH, XL } = place
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        blks.push({
          lat: YL + ((YH - YL) / size) * j, // 左下纬度
          YL: YL + ((YH - YL) / size) * j,
          YH: YL + ((YH - YL) / size) * (j + 1),
          lgt: XL + ((XH - XL) / size) * i, // 左下经度
          XL: XL + ((XH - XL) / size) * i,
          XH: XL + ((XH - XL) / size) * (i + 1),
          blockId: (i * size + j) + amount + (index * size * size),
          co: 1, // retry times
          offset: 0, // 数据初始偏移量
          bkIndex: 1 // 网格内覆盖序号，用于显示进度
        })
      }
    }
  })
  // console.log(`网格分别为：${JSON.stringify(blks)}`)
  return blks
}


// 获取代理列表
const getProxys = () => {
  return axios.get('http://dps.kdlapi.com/api/getdps/?orderid=993551728697871&num=100&pt=1&format=json&sep=1').then(res => {
    // console.log(res.data, typeof(res.data), '================')
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
      'X-Shard': `loc=${119},${29}`,
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_2_2 like Mac OS X) AppleWebKit/604.4.7 (KHTML, like Gecko) Mobile/15C202 MicroMessenger/6.6.1 NetType/4G Language/zh_CN'
    },
    method: 'GET',
    uri: `https://mainsite-restapi.ele.me/pizza/v3/restaurants?offset=0&limit=30&latitude=${29}&longitude=${119}&extras=%5B%22activities%22%5D&extra_filters=home&keyword=&order_by=0&terminal=weapp`,
  }))
  pryCheckSpider.queue(queues)
}

// 地址转换城市信息
const geocoder = (address) => {
  return axios.get(`http://restapi.amap.com/v3/geocode/geo?key=87453539f02a65cd6585210fa2e64dc9&address=${encodeURIComponent(address)}`)
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

// 重试机制，减少错误日志量
const retry = (index, block, uri, proxy, times = 3) => {
  if (block.co > times) {
    sqlquery("INSERT INTO elemeLog1030 SET ?", { uri: uri, status: 0 }).then((result) => {
      console.log(colors.red("ERROR"), `重试3次后依然失败，已加入日志表，url为：${uri} `, error);
    }, (err) => {
      console.log(err)
    })
    return false
  } else {
    console.log(`重试${uri} ----------------------`)
    aproxys = aproxys.filter(e => e !== proxy)
    if (aproxys.length < 3) {
      getProxys().then(
        e => {
          block.co += 1
          runNext(index, block)
        }
      ).catch(err => console.log(err))
    } else {
      block.co += 1
      runNext(index, block)
    }
    return true
  }
}

// 爬虫callback
const config = {
  maxConnections: 100000000,
  jQuery: false,
  callback(error, res, done) {
    const block = res.options.extra.block
    const index = res.options.extra.index
    const uri = res.options.uri
    const proxy = res.options.proxy
    if (error) {
      retry(index, block, uri, proxy)
    } else {
      // const list = res.body ? JSON.parse(res.body) : {}
      if (res.body) {
        console.log(colors.green("SUCCESS"), `请求 ${uri} 成功`)
        const list = res.body ? JSON.parse(res.body) : {}
        // 如果该block列表还有值，更新offset
        if (list && list.items && list.items.length) {
          block.offset += list.items.length
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
              grid: `${restaurant.longitude}, ${restaurant.latitude}`
            }
          })

          // 转换城市，插入数据库，计数
          for (let i = 0; i < final.length; i++) {
            if (!~shopLists.indexOf(final[i].shopId)) {
              shopLists.push(final[i].shopId)
              geocoder(final[i].address).then(cp => {
                final[i].city = cp.city
                final[i].province = cp.province.replace(`'`, '')
                // allList.push(final[i])
                sqlquery("INSERT INTO eleme1031 SET ?", final[i]).then((result) => {
                  console.log(colors.bgBlue("SUCCESS"), `insert into mysql ok, name is ${final[i].name}, count is ${count++}`)
                }, (error) => {
                  console.log(error)
                })
              }).catch(e => console.log(e))
            }
          }
          runNext(index, block)
          // Promise.all(nowAll.map(item => {
          //   return geocoder(item.address).then(cp => {
          //     item.city = cp.city
          //     item.province = cp.province
          //   })
          // })).then(() => {
          //   Promise.all(nowAll.map(item => {
          //     return sqlquery(`select * from eleme1031 where shopId =${item.shopId}`).then(_res => {
          //       if (!(_res && _res.length)) {
          //         sqlquery("INSERT INTO eleme1031 SET ?", item).then((result) => {
          //           console.log(colors.bgBlue("INSERT SUCCESS"), `insert into mysql ok, name is ${item.name}, count is ${count++}`)
          //         })
          //       } else {
          //         console.log(colors.bgGreen('EXISTED PASSED'))
          //       }
          //     })
          //   })).then(() => {
          //     console.log(colors.blue("NEXTBLOCK"), `insert success, count is ${count}`)
          //     runNext(index, block)
          //   }).catch(() => {
          //     console.log(colors.black("NEXTBLOCK"), `insert failed, sth happend`)
          //     runNext(index, block)
          //   })
          // })


        } else {
          // 进度
          console.log(`block ${index} 已完成 ${block.bkIndex} 次 取点，步长为 ${step * 100} 千米`)
          // 列表无值，更新block
          block.offset = 0
          if (block.lat <= block.YH - step) {
            block.lat += step
            block.bkIndex += 1
            runNext(index, block)
          } else {
            if (block.lgt <= block.XH - step) {
              block.lgt += step
              block.lat = block.YL
              block.bkIndex += 1
              runNext(index, block)
            } else {
              console.log(colors.bgRed("BLOCK DONE"), `block: ${block.blockId} has done, count is ${doneCount++}`)
              sqlquery(`update blocks set status =1 where blockId=${block.blockId}`).then(res => {
              })
              done();
            }
          }
        }
      } else {
        // 无返回说明proxy可能有问题，retry
        if (!retry(index, block, uri, proxy)) {
          console.log(`block ${index} 已完成 ${block.bkIndex} 次 取点，步长为 ${step * 100} 千米`)
          // 列表无值，更新block
          block.offset = 0
          if (block.lat <= block.YH - step) {
            block.lat += step
            block.bkIndex += 1
            runNext(index, block)
          } else {
            if (block.lgt <= block.XH - step) {
              block.lgt += step
              block.lat = block.YL
              block.bkIndex += 1
              runNext(index, block)
            }
          }
        }
      }
    }
  }
}

// 首次开始
const run = (blocks) => {
  console.log(`可用proxy列表：${aproxys}`)
  for (let i = 0; i < blocks.length; i++) {
    spiders.push(new Crawler(config))
    const queue = {
      headers: {
        'X-Shard': `loc=${blocks[i].lgt},${blocks[i].lat}`,
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_2_2 like Mac OS X) AppleWebKit/604.4.7 (KHTML, like Gecko) Mobile/15C202 MicroMessenger/6.6.1 NetType/4G Language/zh_CN'
      },
      method: 'GET',
      uri: `https://mainsite-restapi.ele.me/pizza/v3/restaurants?offset=0&limit=30&latitude=${blocks[i].lat}&longitude=${blocks[i].lgt}&extras=%5B%22activities%22%5D&extra_filters=home&keyword=&order_by=0&terminal=weapp`,
      // proxy: `http://derekely1:ljnvl3xr@39.104.92.127:16816`,
      proxy: aproxys[0],
      extra: {
        block: blocks[i],
        index: i
      }
    }
    spiders[i].queue(queue)
  }
}

// 迭代队列
const runNext = (index, block) => {
  // console.log(`可用proxy列表：${aproxys}`)
  const i = (Number((Math.random() * 100).toFixed(0)) % aproxys.length)
  console.log(`选取随机proxy：${aproxys[i]}, block为 ${index} ：${JSON.stringify(block)}`)
  const queue = {
    headers: {
      'X-Shard': `loc=${block.lgt},${block.lat}`,
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_2_2 like Mac OS X) AppleWebKit/604.4.7 (KHTML, like Gecko) Mobile/15C202 MicroMessenger/6.6.1 NetType/4G Language/zh_CN'
    },
    method: 'GET',
    uri: `https://mainsite-restapi.ele.me/pizza/v3/restaurants?offset=${block.offset}&limit=30&latitude=${block.lat}&longitude=${block.lgt}&extras=%5B%22activities%22%5D&extra_filters=home&keyword=&order_by=0&terminal=weapp`,
    proxy: aproxys[i],
    extra: {
      block: block,
      index: index
    }
  }
  spiders[index].queue(queue)
}

// 开始
const start = () => {
  sqlquery('select count(*) as num from blocks').then(res => {
    const amount = res[0].num
    const blocks = getBlocks(size, [suzhou], amount)
    for (let i = 0; i < blocks.length; i++) {
      const item = {
        blockId: blocks[i].blockId,
        content: JSON.stringify(blocks[i]),
        status: 0
      }
      sqlquery('insert into blocks set ?', item).then(res => {
      })
    }

    getProxys().then(e => setTimeout(() => {

      run(blocks)
    }, 10000)).catch(err => console.log(err))
  })

}

// retry blocks
const startV2 = () => {
  getProxys().then(e => setTimeout(() => {
    sqlquery(`select content from blocks where status=0`).then((res) => {
      const blocks = res.map(item => JSON.parse(item.content))
      sqlquery('select shopId from eleme1031').then(_item => {
        shopLists = _item.map(__item => __item.shopId)
        run(blocks)
      })
    })
  }, 10000)).catch(err => console.log(err))
}

const insert = () => {
  for (let i = 0; i < allList.length; i++) {
    const item = allList[i]
    sqlquery(`select shopId from eleme1031`).then(_res => {
      if (_res && (_res.map(tt => tt.shopId)).indexOf(item.shopId) === -1) {
        sqlquery("INSERT INTO eleme1031 SET ?", item).then((result) => {
          console.log(colors.bgBlue("INSERT SUCCESS"), `insert into mysql ok, name is ${item.name}, count is ${count++}`)
        })
      } else {
        console.log(colors.bgGreen('EXISTED PASSED'))
      }
    })
  }
}

// start()
startV2()
