const puppeteer = require("puppeteer");
module.exports = class PageSnapshot {
  constructor(ctx) {
    this.ctx = ctx;
    this.logger = ctx.logger;
  }

  async start() {
    // 启动一个 Headless Chrome
    this.browser = await puppeteer.launch();
    // 启动完毕
    this.logger.info("Service PageSnapshot Started");
  }

  async stop() {
    // 关闭 Headless Chrome
    await this.browser.close();
    // 启动完毕
    this.logger.info("Service PageSnapshot Stopped");
  }

  async bing(pages) {
    const page = await this.browser.newPage();
    page.setViewport({ width: 1920, height: 1080 });

    const imgList = [];
    await page.goto(`https://bing.ioliu.cn/?p=${pages}`);
    const singlePage = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll("a.mark"));
      return imgs.map(e =>
        e.href
          .replace(/https:\/\/bing.ioliu.cn\/photo/, "http://h1.ioliu.cn/bing/")
          .replace(/\?force=home_\d/, "_1920x1080.jpg")
      );
    });
    // for (let j = 0; j < singlePage.length; j++) {
    //   await page.goto(singlePage[j]);
    //   const buf = await page.screenshot({ type: "jpeg", quality: 60 });
    //   const base64 = buf.toString("base64");
    //   imgList.push(base64);
    // }

    console.log(singlePage, '0000')

    return {
      list: singlePage
    };
  }

  async take(url) {
    const page = await this.browser.newPage();
    page.setViewport({ width: 1920, height: 1080 });
    await page.goto(url);
    const buf = await page.screenshot({ type: "jpeg", quality: 60 });
    await page.close();
    return {
      // 现在 IPC Hub 不能直接传递 Buffer，需要 base64。
      base64: buf.toString("base64")
    };
  }
};