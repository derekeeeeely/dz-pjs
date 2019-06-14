# service worker
## 简介

service worker是一个由来已久的HTML5 API，旨在创建持久的离线缓存。类似于web worker，都是在浏览器后台单独开的一个线程内工作，可以向客户端推消息，不可操作dom。

service worker有自己的worker context，可以拦截请求和返回，缓存文件，必须在HTTPS或者本地环境下运行，异步实现，内部大部分通过Promise实现

依赖Cache API，依赖FTML5 fetch API，依赖Promise实现离线缓存功能


## 生命周期


parsed -> installing -> installed -> activating -> activated -> redundant

![引用](https://ws4.sinaimg.cn/large/006tNc79gy1ftfl3ewgcbj30g30o3whj.jpg)

### 注册

注册在主线程中进行

```js
if (navigator.serviceWorker) {
  // register异步方法
  navigator.serviceWorker.register('./sw.js', { scope: '/' }).then(() => {
    console.log('sw service worker 注册成功')
    console.log('parsed ----> installing')
  }).catch((err) => {
    console.log(err)
  })
}
```
- 注册时的scope可选，默认是sw.js所在目录，表示该worker可以接收该目录下的所有fetch事件
- 每次调用egister会判断worker是否已注册再进行处理
- 注册成功的worker有了自己的worker context，此时表示worker的脚本被成功解析，转入installing状态

### 安装

在worker的脚本文件中监听install事件，可以维护初始缓存列表
```js
self.addEventListener('install', (event) => {
  // 确保安装完成前完成下面的操作
  event.waitUntil(
    // 创建一个cache
    caches.open('v1').then((cache) => {
      // cache是缓存实例
      // 调用该实例的addAll方法提前加载相关文件进缓存
      return cache.addAll([
        '/html/test.js',
        '/html/default.html'
      ])
    })
    console.log('installing ----> installed ----> activating')
  )
  // self.skipWaiting() 直接进入activate
})
```


### 激活

worker安装完成后会转为installed/activating状态，在满足以下条件之一时可以转为activate状态
  - 没有active worker在运行或者旧的worker被释放(页面关闭)
  - 调用self.skipWaiting()跳过waiting，进入activate状态

activated状态会触发activate回调，在worker监本中监听activate事件

```js
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.filter(function (cacheName) {
          return cacheName != 'v1';
        }).map(function (cacheName) {
          // 清除旧的缓存
          return caches.delete(cacheName);
        })
      )
    })
    console.log('activating ----> activated')
  )
  // self.clients.claim() 获取页面控制权，旧的worker失效
})
```

### 激活后的控制

激活后可以控制页面行为，可以处理功能事件，如`fetch`, `push`, `message`

符合worker的scope内的资源请求都会触发fetch被控制
```js
self.addEventListener('fetch', function (event) {
  // 利用respondWith劫持响应
  event.respondWith(
    caches.open('v1').then(function (cache) {
      return cache.match(event.request).then(function (response) {
        // match到则返回否则直接请求
        return response || fetch(event.request).then(function (response) {
          // 404抛错到catch处理
          if (response.status === 404) {
            throw new Error('nothing')
          }
          // 将response作为value存入cache
          // install时可以进行缓存
          // 劫持fetch时也可以进行动态资源缓存
          cache.put(event.request, response.clone());
          return response;
        }).catch((err) => {
          // 返回cache storage里存的默认页面
          return caches.match('/html/default.html');
        });
      });
    })
  );
});
```

localStorage是同步的，所以不能用于service worker内的存储，IndexedDB可以用

### 废弃状态

安装失败、激活失败、被新的worker取代时转入废弃状态

## chrome中查看

![](https://ws1.sinaimg.cn/large/006tNc79gy1ftfjcmbvlzj313y0fitar.jpg)

## 更新

当service worker脚本内容更新时，会安装新的文件并触发install，转入installed/waiting状态。此时旧的worker仍处于激活状态，在页面关闭后会被废弃，此后新开页面里新的worker才会生效

![](https://ws1.sinaimg.cn/large/006tKfTcgy1ftfm040r2fj313u0je0vl.jpg)

上图为更改`sw.js`后刷新页面的结果，关闭页面重开后1497将是激活中的worker

### 强制更新和检查更新

一般为24小时

### 自动更新worker

```js
// 跳过等待，直接进入activate
self.addEventListener('install', function (event) {
    event.waitUntil(self.skipWaiting());
});
// actived之前更新客户端
self.addEventListener('activate', function (event) {
  event.waitUntil(
    Promise.all([
      // 更新客户端所有的service worker
      self.clients.claim(),
      // 清理旧版本
      caches.keys().then(function (cacheList) {
        return Promise.all(
          cacheList.map(function (cacheName) {
            if (cacheName !== 'v1') {
              return caches.delete(cacheName);
            }
          })
        )
      })
    ])
  )
)}
```


### 手动更新

主线程内每次注册时进行更新

```js
var version = '1.0';
navigator.serviceWorker.register('./sw.js').then(function (reg) {
  if (localStorage.getItem('sw_version') !== version) {
    // reg.update
    reg.update().then(function () {
      localStorage.setItem('sw_version', version)
    });
  }
});
```

debug时更新

```js
self.addEventListener('install', function () {
  if (ENV === 'development') {
    // 每次刷新页面重新注册安装时直接进入activate，确保最新
    self.skipWaiting();
  }
});
```

## cacheStorage

cacheStorage是在serviceworker规范中定义的接口，我们可以使用全局的caches访问cacheStorage

caches常用api有: `open`, `match`, `delete`, `has`, `keys`

![cache storage](http://opo02jcsr.bkt.clouddn.com/7-19-2018,-8:49:48-PM.png)

## 实例

代码位于[github](https://github.com/derekeeeeely/dz-FE/tree/master/frontend/basic/html)

### steps

- 本地利用`koa-static`建一个静态页面的server

    ```js
    const Koa = require('koa')
    const path = require('path')
    const static = require('koa-static')
    const app = new Koa()
    const staticPath = './frontend/basic'
    app.use(static(
        path.join(__dirname, staticPath)
    ))
    ```
- 页面中插入脚本

    ```js
    window.addEventListener('load', function () {
        if (navigator.serviceWorker) {
            navigator.serviceWorker.register('./sw.js').then(() => {
                console.log('sw service worker 注册成功')
            }).catch((err) => {
                console.log(err)
            })
        }
    })
    ```

- `sw.js` 见 [github](https://github.com/derekeeeeely/dz-FE/tree/master/frontend/basic/html/sw.js)

### 最终效果

- offline模式下，可以从cache中读取文件缓存
    ![from service worker](https://user-gold-cdn.xitu.io/2018/7/20/164b3b35b23c149c?w=2048&h=460&f=jpeg&s=121777)
- 不存在的资源路径返回缓存好的`default.html`
- 二次访问缓存list内的资源时劫持请求和响应，返回缓存内容

    ![cache storage](https://user-gold-cdn.xitu.io/2018/7/20/164b3b44ede88fc2)