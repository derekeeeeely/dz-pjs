# 浏览器

> 从输入url到展示页面经历了什么？

- 接收输入，开启线程处理
- 调用方法分析url
- DNS解析获取对应IP地址
  - DNS(domain name system)，解析过程由host->本地域名解析器缓存->本地域名服务器->根域名服务器->顶级域名服务器->二级域名服务器
  - DNS prefetch可以使浏览器主动去执行域名解析，域名解析在后台执行，可能链接出现前已经解析完了，可以减少用户点击链接时的延迟，比如
    ```
    // taobao主页
    <link rel="dns-prefetch" href="//g.alicdn.com" />
    <link rel="dns-prefetch" href="//img.alicdn.com" />
    ```
- 与服务器建立连接，确认后发送报文
- 到达服务器处理请求，后端应用处理请求
- 服务器返回响应报文，适用相应缓存策略
- 浏览器下载文档（考虑缓存策略）
- 解析html建立dom tree，下载css/js
- 解析渲染dom，css根据规则结合dom进行内容布局和绘制渲染，js根据dom api操作dom，执行事件绑定等至展示过程完成

## 浏览器组成

![20170516149492235386286.png](http://opo02jcsr.bkt.clouddn.com/20170516149492235386286.png)

- 用户界面
- 浏览器引擎 (查询和操作渲染引擎的接口)
- 渲染引擎 (显示页面内容)
- 网络模块
- js引擎 (负责js解释执行，如V8引擎)
- UI后端 (绘制基本的浏览器窗口内控件)
- 数据持久化存储 (可通过浏览器引擎提供的接口调用)

### 渲染引擎

渲染引擎负责解析html和css，将css规则应用到html标签上，并将html渲染为页面上具体的dom内容

#### 过程

- 解析html生成dom tree
- 将dom树节点顺序提取，结合css规则计算样式数据，构建render tree
- render tree布局，根据每个渲染树节点的布局属性将节点固定到页面的对应位置
- 绘制render tree，将元素的显示属性（背景、颜色、文本等）应用到节点，完成整个dom在页面上的显示

页面元素位置变化将导致重排和重绘(即布局和绘制阶段重新渲染)，位置不变但是显示样式变化则会导致重绘。重新渲染的代价比较大，所以应劲量避免重排，减少重绘。

#### Gecko与Webkit

![gecko-webkit](http://opo02jcsr.bkt.clouddn.com/7-19-2018,-11:23:12-AM.png)

两者在渲染引擎部分很类似，但也有区别。前者的css解析是在html解析完生成内容sink之后进行的，结合构建的树叫做frame tree，后者css解析和html解析可以认为是并行的。

#### 解析详解

- html解析

  从html文本标签经过词法分析->parse成dom对象，每个标签中的每个元素在解析后对应都有一个原始类型

  ![html-dom](http://opo02jcsr.bkt.clouddn.com/7-19-2018,-11:31:46-AM.png)

  ```
  let element = document.getElementById('div')
  let type = Object.prototype.toString.call(element).slice(8, -1)
  console.log(type)
  // HTMLDivElement
  ```

  dom元素标签是文本化的html标识，dom元素对象是一个带有父子关系的树形对象

- css解析

  css文件被解析成一个CSSStyleSheet对象，该对象内存在多个CSSStyleRule，每个rule包含有选择器信息和声明对象（样式信息）

  ![css-rule](http://opo02jcsr.bkt.clouddn.com/7-19-2018,-11:33:46-AM.png)

- render tree

  生成render tree的时候会遍历dom树的节点，为每个节点找到css rule并根据优先级（老生常谈的权重判断方式）将多条rule合并生成最终该节点的样式信息添加到render tree上。

### 数据持久化

#### HTTP文件缓存

![cache-rule](http://opo02jcsr.bkt.clouddn.com/7-19-2018,-1:10:19-PM.png)

- cache-control/expire 前者是相对时间，后者是绝对时间

  ```
  // 前端设置
  <meta http-equiv="Cache-Control" content="max-age=7200" />
  <meta http-equiv="Expires" content="Mon, 16 Jul 2018 23:00:00 GMT" />
  ```
- Etag和Last-Modified是返回头中的信息，当本地缓存失效时会将这些信息一起发送至服务端进行对比
- 服务端进行决策是否有更新，返回200或者304

#### localStorage

- 单个域名下的localStorage大小限制在几M
- 浏览器多个标签页打开同一域名页面时localStorage是共享的
- 简单的几个方法`getItem`, `setItem`, `removeItem`, `clear`

#### sessionStorage

- 会话结束时(浏览器关闭)自动清空

#### Cookie

- basics

  - 单个域名下的cookie大小限制在4K
  - 每个cookie都是`<key>=<value>`的形式
  - cookie类型为string
  - cookie有域(domain)和路径(path)的概念，一般不可跨域访问，路径遵循子目录可访问的规则
  - secure保证cookie在传输过程中加密

  ```
  document.cookie='name=123;expires=date;path=path;domain=domain;secure'
  ```

- session cookie和持久性cookie

  前者生命周期为浏览器会话期间，保存在内存中，后者一般会设置过期时间，保存在硬盘上，到期后才会被清空失效

- HttpOnly属性

  ![httponly](http://opo02jcsr.bkt.clouddn.com/7-19-2018,-1:39:52-PM.png)

  设置了HttpOnly的cookie只能通过请求头发送到服务端进行读写操作，避免了被前端js修改，保证了服务端验证cookie的安全性

- 操作

  ```
  document.cookie = 'name=123' // add
  document.cookie = 'name=1234' // edit
  document.cookie = 'name=1234;expires=xxxx' // expires为过去时间，则delete
  ```

#### Web SQL和IndexedDB

  在客户端进行数据存储，适用场景不是很多，也存在一些安全问题，且行且看

#### Application Cache

- 通过manifest配置文件实现本地缓存的解决方案
- 在第二次访问时，访问appCache，检查manifest文件是否更新，将更新的文件重新拉取并更新cache
- 离线存储的容量限制为5M，缓存文件必须和manifest同源
- 将被废弃，被sevice worker替代(后续pwa了解一下)

#### CacheStorage

  这部分涉及到service worker，不是三言两语能说清，所以请转到 [这里](serviceworker.md)
