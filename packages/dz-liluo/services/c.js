const http = require("http");

module.exports = class HTTPServer {
  constructor(ctx) {
    this.config = ctx.config;
  }
  test() {
    return 'test c'
  }
  start() {
    http
      .createServer((req, res) => {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Hello Pandora.js");
      })
      .listen(this.config.port);
    console.log("Listening Port " + this.config.port + "...");
    console.log(process.pid)
  }
  stop() {
    console.log("Stoping");
  }
};