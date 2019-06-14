'use strict';

module.exports = (pandora) => {

  pandora
    .cluster('./src/server/index.js');

  // 定义两个进程
  pandora
    .process("puppeteer")
    .scale(1);
  pandora
    .process("web")
    .scale(1);

  // 爬虫服务，爬取图片
  pandora
    .service('PageSnapshot', './services/puppeteer.js')
    .process('puppeteer')
    .publish();
  // 将爬取到的图片返回客户端
  pandora
    .service("WebServer", "./services/web.js")
    .process("web")
    .config({
      port: 1236
    });

  // // 定义两个进程
  // pandora
  //   .process('a')
  //   .scale(1);
  // pandora
  //   .process('b')
  //   .scale(1);
  // pandora
  //   .process('c')
  //   .scale(1);

  // // 定义 ServiceA 在 进程 a ，并且发布至 IPC-Hub
  // pandora
  //   .service('serviceA', './services/a.js')
  //   .process('a')
  //   .publish();

  // // 定义 ServiceB 在进程 b
  // pandora
  //   .service('serviceB', './services/b.js')
  //   .process('b');

  // pandora
  //   .service("serviceC", "./services/c.js")
  //   .config(ctx => {
  //     return { port: 1342 };
  //   })
  //   .process("c")
  //   .publish();


  /**
  * you can custom workers scale number
  */
  // pandora
  //   .process('worker')
  //   .scale(2); // .scale('auto') means os.cpus().length

  /**
   * you can also use fork mode to start application
   */
  // pandora
  //   .fork('dz-liluo', './src/server/index.js');

  /**
   * you can create another process here
   */
  // pandora
  //   .process('background')
  //   .nodeArgs(['--expose-gc']);

  /**
   * more features please visit our document.
   * https://github.com/midwayjs/pandora/
   */

};