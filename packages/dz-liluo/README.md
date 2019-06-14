# dz-liluo

### 初衷

- 最初是准备给有统计需要的朋友写一个小工具
- 内容大概就是实现导入表格，存入数据库，程序读取数据，处理数据获得预期结果并图表可视化展示
- 最初设计
  - 前端使用`react`搭页面，`echart`作图
  - server使用`koa`，数据库使用`mysql`
  - 前端mvx，功能简单不需要
  - 打包使用`parcel`

### 后来

- 偶然看到`pandora`，感觉挺有意思
- 觉得可能对于平时工作也好，对于自己项目也好都是一个很不错的工具，遂决心了解
- 以此项目为实验品进行改造，仅供学习参考

### `pandora`

- [git地址](https://github.com/midwayjs/pandora)
- 改造
  - 初始化
    - `node`版本需大于8.0，直接`yarn`/`npm`安装即可
    ```js
    // 生成配置文件procfile.js
    pandora init ./app.js //你的应用入口文件
    // procfile.js
    module.exports = (pandora) => {
      // 实际上对于原项目的影响就是改写启动的script罢了
      pandora
      .cluster('./src/server/index.js');
    }
    ```
    - 可视化面板
    ```js
    npm i pandora-dashboard -g # 全局安装，会全局注册一个命令 pandora-dashboard-dir
    pandora start --name dashboard `pandora-dashboard-dir` # 使用该命令获得路径，用于启动
    ```
    打开`http://127.0.0.1:9081/`，你将看到一个dashboard应用
    ![](http://opo02jcsr.bkt.clouddn.com/0e1937e14926631ad14465268a3a5b7f.png)


  - process 和 service
    - 个人觉得pandora好玩的一点是他的进程管理，不同于传统的通过cluster实现多进程，pandora可以让你在应用的worker进程之外手动起额外的进程
    ```js
    // procfile.js
    // 定义两个进程，一个利用google的puppeteer来爬取数据
    // 另一个进程用于运行http server
    // scale大于1可以启用多个worker进程
    pandora
      .process("puppeteer")
      .scale(1);
    pandora
      .process("web")
      .scale(1);

    // 起了两个进程的目的是为了在原有应用的基础上添加服务
    // 爬虫服务，爬取图片
    pandora
      .service('PageSnapshot', './services/puppeteer.js')
      .process('puppeteer')
      .publish();
    // http server，将爬取到的图片返回客户端
    pandora
      .service("WebServer", "./services/web.js")
      .process("web")
      .config({
        port: 1236
      });
    ```
    dashboard点进去以后可以看到进程树里多了两个独立进程
    ![](http://opo02jcsr.bkt.clouddn.com/ed7c8f3fa6c08846ed05f54799ba2397.png)

    - 关于service
      - 每个service实际上是一个类，相当于往对应的进程内注入一个node程序
      - service可以定义依赖关系，传入config，发布到IPC-Hub(用于进程间通信)，具体参考[官方文档](http://www.midwayjs.org/pandora/zh-cn/process/service_std.html)
      - service的实现主要在于`start`和`stop`方法，在进程启用的时候会调用service的`start`方法，这个方法里可以做很多事情，`stop`在应用退出时调用，可以做平滑下线，具体怎么搞还没研究清
      - 发布到IPC-Hub的服务可以在别的进程中通过`ctx.getProxy`方法获取到，实现进程间通信

    - PageSnapshot服务
    ```js
    // puppeteer.js
    async start() {
      // 启动一个无头chromium
      this.browser = await puppeteer.launch();
    }
    // bing方法，在WebServer服务中调用，用于爬取图片
    async bing(pages) {
      // 非常不好意思，爬的是某大佬辛苦写的一个bing图库...
      // 因为图方便...仅为学习，别无他意
    }
    ```
    - WebServer服务
    ```js
    // web.js
    const snapshot = await pageSnapshot.bing(targetUrl);
    const imgList = snapshot.list;
    // 返回给客户端
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    });
    const json = JSON.stringify({
      list: imgList
    })
    res.end(json);
    ```
    - 最终成果
    ![](http://opo02jcsr.bkt.clouddn.com/808de031efe7359dc5336da7f8f283aa.png)

  - 说明
    - 新东西刚出来的时候资料啥的都比较少，对于我这种小菜鸡来说更是仰仗大佬们的文章才能学个皮毛
    - 评价下觉得是个很有趣的东西，值得学习，比较期待后续更深入学习
  - tolearn
    - 自定义service的状态管理，数据收集和监控
    - trace和metrics了解和扩展(看到Metrics里面分代占用内存情况的时候小渣渣表示震惊)
    - 和dubbo的结合是否可实现

### todo

- 既然当了一回小白鼠，也就不在乎第二回了，计划把这个项目用在学习docker上~

