const puppeteer = require("puppeteer");
const { sqlquery } = require("../src/server/utils");
const moment = require("moment")
module.exports = class Puppeteer {
  constructor(ctx) {
    this.ctx = ctx;
    this.logger = ctx.logger;
  }

  async start() {
    this.browser = await puppeteer.launch();
    console.log(`service puppeteer started at process spider with pid: ${process.pid}`);
    this.juejin()
    setInterval(() => {
      console.log('get essay from juejin again')
      this.juejin()
    }, 1000*60*60*6)
  }

  async stop() {
    await this.browser.close();
    console.log("service puppeteer stopped");
  }

  async juejin() {
    const page = await this.browser.newPage();
    page.setViewport({ width: 1920, height: 1080 });
    await page.goto(`https://juejin.im/welcome/frontend`);
    const date = moment(new Date()).format('YYYY/MM/DD HH:mm:ss')

    const essays = await page.evaluate(() => {
      const oneScreen = Array.from(document.querySelectorAll(".content-box .info-box .info-row.title-row .title"));
      return oneScreen.map(e => ({ href: e.href, title: e.innerHTML }));
    });

    for (let i = 0; i < essays.length; i++) {
      essays[i].date = date
      try {
        await sqlquery("INSERT INTO test SET ?", essays[i])
        console.log("insert into test success")
      } catch (error) {
        console.log(error)
      }
    }

    await page.close();
    return {
      done: true
    }
  }

};
