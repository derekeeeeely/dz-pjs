const Crawler = require('crawler')
const colors = require('colors/safe')
// const axios = require('axios')
const { sqlquery } = require('../utils')


// 全国坐标范围
const XL = 73.6
const XH = 135.1
const YL = 17
const YH = 53.6

const size = 50

// 生成网格
const getBlocks = (size) => {
  const blks = []
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      blks.push({
        lat: YL + ((YH - YL) / size) * j, // 左下纬度
        YL: YL + ((YH - YL) / size) * j,
        YH: YL + ((YH - YL) / size) * (j + 1),
        lgt: XL + ((XH - XL) / size) * i, // 左下经度
        XL: XL + ((XH - XL) / size) * i,
        XH: XL + ((XH - XL) / size) * (i + 1),
        co: 1, // retry times
        offset: 0, // 数据初始偏移量
        bkIndex: 1 // 网格内覆盖序号，用于显示进度
      })
    }
  }
  console.log(`网格分别为：${JSON.stringify(blks)}`)
  return blks
}

const ss = new Map()

const spider = new Crawler({
  callback(error, res, done) {
    if (error) {
      console.log(colors.red("ERROR"), "spider error:", res.options.uri, error);
    } else {
      const list = JSON.parse(res.body)
      if (list.length) {
        list.map(e => {
          ss.set(e.orgCode, e)
        })
      }
      console.log(Array.from(ss).length, '===============')
      console.log(colors.green("SUCCESS"), `fetch ${res.options.uri} success`)
    }
    done()
  }
})

const run = () => {
  const blocks = getBlocks(size)
  const queue = []
  blocks.map(e => {
    queue.push({
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
        lblng: e.XL,
        rtlng: e.XH,
        lblat: e.YL,
        rtlat: e.YH
      },
      uri: `http://116.228.70.238:8801/YTO_GPSITF_WEB/PlatformService?AppId=D7EFC29F0583C0E1E040010A9CCB1ED8&dbType=gisowConfig`,
    })
  })
  spider.queue(queue)
}

run()

