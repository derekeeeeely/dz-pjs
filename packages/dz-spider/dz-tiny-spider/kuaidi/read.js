const levelup = require('levelup')
const leveldown = require('leveldown')
const colors = require('colors/safe')
const cheerio = require('cheerio')
const { Transform } = require('stream')
const fs = require('fs')
const through2 = require('through2')
const csvWriter = require('csv-write-stream')
const axios = require('axios')


const db = levelup(leveldown('./db'))
const writer = csvWriter({
    headers: ['url', '快递公司',	'站点名称',	'网点联系人',	'地址',	'联系电话',	'投诉电话',	'派送区域',	'不派送区域','详细地址', '坐标']
})

const Parser = new Transform({
    readableObjectMode: true,
    writableObjectMode: true,
    transform({key:url, value:html}, encoding, callback) {
        const result = parse(html.toString())
        geocoder(result[3]).then(latlng => {
            result[8] = latlng;
            result.unshift(url.toString())
            this.push(result)
            callback();
        }).catch(callback)
    }
});

// writer.pipe(fs.createWriteStream('out.csv'))

let count = 0
// db.createReadStream().pipe(Parser).pipe(writer).pipe(fs.createWriteStream('out.csv'))
//   .on('error', function (err) {
//     console.log('Oh my!', err)
//   })
//   .on('close', function () {
//     console.log('Stream closed')
//   })
//   .on('end', function () {
//     console.log('Stream ended', count)
//   })
let a = 0;
db.createReadStream().pipe(through2({objectMode: true, allowHalfOpen:false, highWaterMark: 1000}, function ({key:url, value:html}, encod, callback) {
    const result = parse(html.toString())
    result.unshift(url.toString())
    let index = a++;
    geocoder(result[9]).then(
    geo => {
        console.log('finish ',index)
        result[10] = geo
    }, 
    e => {
        console.log(e)
        result[10] = "";
    }).then(_ => this.push(result))
    callback()
}))
.pipe(writer).pipe(fs.createWriteStream('list.csv'))
.on('error', function (err) {
console.log('Oh my!', err)
})
.on('close', function () {
console.log('Stream closed')
})
.on('end', function () {
console.log('Stream ended', count)
})

// db.get('https://www.ickd.cn/outlets/detail-rzZF4gI658.html').then(value => {
//     const result = parse(value.toString());
//     axios.get(`http://api.map.baidu.com/geocoder/v2/?address=${encodeURIComponent(result[3])}&output=json&ak=uObAz3PnNGtZMQBxPn1U2br2Ld6I2EAd`)
//     .then(res => {
//         const resp = res.data
//         if(resp.status == 0 && resp.result && resp.result.location) {
//             result[8] = `${resp.result.location.lat},${resp.result.location.lng}`
//         } else {
//             console.log(resp)
//             result[8] = ''
//         }
//         console.log(result)
//     })
//     .catch(e => console.log(e))
// })

function parse(dom) {
    const result = [];
    const $ = cheerio.load(dom)
    // 快递公司
    result[0] = $(".page-nav a").eq(2).text().trim()
    // 网点名称
    result[1] = $("#info h1").text().slice(0,-2)
    // 基本信息
    const info = $('#info .b p').eq(0).text().split('\n').map(s => s.trim());
    // 网点联系人， 网点地址
    [result[2], result[3]] = info.map(s => s.slice(s.indexOf('：') + 1).trim())
    // 网点电话
    result[4] = $('#info .b').eq(1).text().trim().slice(4).trim()
    // 投诉电话
    result[5] = "";
    // 派送区域
    result[6] = $('#info .b').eq(2).text().trim().slice(4).trim()
    // 不派送区域
    result[7] = $('#info .b').eq(3).text().trim().slice(4).trim()
    // 详细地址
    result[8] = $(".page-nav a").text().slice(6+result[0].length) + result[3]

    return result
}

function geocoder(address) {
    return axios.get(`http://restapi.amap.com/v3/geocode/geo?key=87453539f02a65cd6585210fa2e64dc9&address=${encodeURIComponent(address)}`)
    .then(res => {
        const resp = res.data
        if(resp.status == 1 && resp.count >= 1 && resp.geocodes) {
            return resp.geocodes[0].location
        } else {
            console.log(resp)
            return ''
        }
    })
}

// geocoder("山西长治华丰南路131号").then(lo => console.log(lo))

// db.get('https://www.ickd.cn/outlets/detail-17957.html').then(data => parse(data.toString())).then(console.log)