const http = require("http");
const { promisify } = require('util')
const querystring = require('querystring');
const url = require('url');

module.exports = class ServiceA {

  constructor(ctx) {
    this.ctx = ctx;
    this.config = ctx.config;
    this.logger = ctx.logger;
  }

  getPid() {
    return process.pid
  }

  async start () {
    this.server = http.createServer((req, res) => {
      this.onRequest.call(this, req, res).catch((err) => {
        try {
          res.writeHead(500, {'Content-Type': 'text/plain'});
          res.end(err && (err instanceof Error ? err.toString() : JSON.stringify(err)));
        } catch(err) {
          this.logger.error(err);
          res.end();
        }
      });
    })
    await promisify(this.server.listen).call(this.server, this.config.port);
    console.log(`web server is up at ${this.config.port}, pid is ${process.pid}`)
  }

  async onRequest(req, res) {
    const query = querystring.parse(url.parse(req.url).query);
    const targetUrl = query.url;

    // 获取PageSnapshot服务
    const pageSnapshot = await this.ctx.getProxy('PageSnapshot', {
      timeout: 20 * 1000
    });
    const snapshot = await pageSnapshot.bing(targetUrl);
    const imgList = snapshot.list;
    // const result = []
    // for (let i = 0; i < imgList.lenght; i++) {
    //   const jpg = new Buffer(imgList[i], "base64");
    //   result.push(jpg)
    // }

    // 返回给客户端
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    });
    const json = JSON.stringify({
      list: imgList
    })
    res.end(json);
  }

  async stop() {
    await promisify(this.server.close).call(this.server);
    console.log(`web server is closed`)
  }
};
