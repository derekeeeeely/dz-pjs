const Crawler = require("crawler");
const levelup = require('levelup')
const leveldown = require('leveldown')
const colors = require('colors/safe')

const db = levelup(leveldown('./db'))

const listSpider = new Crawler({
    maxConnections : 10,
    headers: {
        'Cookie': 'Hm_lvt_39418dcb8e053c84230016438f4ac86c=1521095965; JSESSIONID=27041BBB2A11259C8E83CEB249E25745; hide-qr=1; Hm_lpvt_39418dcb8e053c84230016438f4ac86c=1521098206',
        'Origin': 'https://www.ickd.cn',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36',
        'Content-Type': 'application/json',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Referer': 'https://www.ickd.cn/outlets/anneng.html',
        'Connection': 'keep-alive'
    },
    callback(error, res, done) {
        if(error){
            console.log(colors.red("ERROR")," listSpider error:", res.options.uri, error);
        }else{
            console.log(colors.green("SUCCESS"),`fetch ${res.options.uri}`)
            const $ = res.$;
            $("#net-list-left .net-info .title a").each((i, a) => {
                let detailHref = a.attribs.href
                let uri = "https://www.ickd.cn/outlets/" + detailHref
                detailSpider.queue(uri)
            })
        }
        done()
    }
})

const detailSpider = new Crawler({
    maxConnections : 20,
    headers: {
        'Cookie': 'Hm_lvt_39418dcb8e053c84230016438f4ac86c=1521095965; JSESSIONID=27041BBB2A11259C8E83CEB249E25745; hide-qr=1; Hm_lpvt_39418dcb8e053c84230016438f4ac86c=1521098206',
        'Origin': 'https://www.ickd.cn',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36',
        'Content-Type': 'application/json',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Referer': 'https://www.ickd.cn/outlets/anneng.html',
        'Connection': 'keep-alive'
    },
    callback(error, res, done) {
        if(error){
            console.log(colors.red("ERROR"), "detailSpider error:", res.options.uri, error);
        }else{
            console.log(colors.green("SUCCESS"),`fetch ${res.options.uri}`)
            db.put(res.options.uri, res.body).catch(e => {
                console.log(colors.red("ERROR"), 'detailSpider save error:',res.options.uri, e)
            })
        }
        done()
    }
})


function run(begin, end) {
    const arr = new Array(end - begin)
    const queue = arr.fill(0).map((_,index) => {
        let i = index + begin;
        return {
            uri: `https://www.ickd.cn/outlets/index${i == 1? "":"_"+i}.html`,
            proxy: 'http://122.228.25.97:8101'
        }
    })
    listSpider.queue(queue)
}


run(1, 14655)