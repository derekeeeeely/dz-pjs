# web IM

web IM(即时通讯)指的是web浏览器之间实现的即时数据交流

## 常见实现方式

### 轮询

最简单的实现方式，由客户端定时向服务端请求数据

```js
// 设置定时器，每秒向服务器请求数据
const xhr = new XMLHttpRequest()
setInterval(() => {
  xhr.open('GET','/test')
  xhr.onreadystatechange = () => {}
  xhr.send()
}, 1000)
```

评价：最简单，但是请求次数太多，每次都要建立连接，对服务器压力也很大，大部分时间数据是没有更新的，浪费带宽。

### 长轮询

服务端接收客户端请求后暂时挂起，等待数据更新，有数据更新则响应，否则等到达到服务端设置的时间限制后再响应。客户端接收到响应后会再发出请求，重新建立连接，如此往复。

#### 简单实现

- 前端请求
```js
ajax = () => {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', '/test')
  xhr.timeout = 10000
  xhr.onreadystatechange = () => {
    // 此时服务器已返回数据
    if (xhr.readyState === 4) {
      const content = document.getElementById("message")
      content.innerHTML = `${content.innerHTML}\n${xhr.responseText}`
      // 重新建立连接
      ajax()
    }
  }
  xhr.send()
}
window.onload = () => {
  ajax()
}
```
- 发送消息
```js
//
document.getElementById("sub").onclick = () => {
  const xhr = new XMLHttpRequest()
  const text = document.getElementById("text").value
  xhr.open('POST', '/message')
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send(`message=${text}`)
}
```

- node server

```js
// 使用EventEmitter进行事件监听
const EventEmitter = require('events').EventEmitter
const messageBus = new EventEmitter()
messageBus.setMaxListeners(100)

app.use(async (ctx) => {
  if (ctx.request.url === '/test') {
    const result = await new Promise((resolve, reject) => {
      // 监听message，长轮询返回
      messageBus.on('message', function (data) {
        resolve(data)
      })
    })
    ctx.body = result
  }
  // 接收到message，触发事件
  if (ctx.request.url === '/message') {
    messageBus.emit('message', ctx.request.body.message)
    ctx.body = 'done'
  }
})
```

- 成果图

![](http://opo02jcsr.bkt.clouddn.com/7-25-2018,-3:43:55-PM.png)

减少了请求次数，但服务端挂起依然是资源浪费。轮询与长轮询都是服务被动型，都是由客户端发起请求。

具体代码见 [github](https://github.com/derekeeeeely/dz-FE)

### 长连接

SSE(Server-Sent Events)是H5新增的功能，允许服务端主动向客户端推送数据。

- 客户端

```js
// 客户端会在连接失败后默认重连
const source = new EventSource('/sse')
// 默认为message，这里的test1为自定义
source.addEventListener('test1', (res) => {
  console.log(res)
}, false)
source.onopen = () => {
  console.log('open sse')
}
source.onerror = (err) => {
  console.log(err)
}
// source.close(); // 用于关闭连接
```

- node server

```js
const Readable = require('stream').Readable

// 创建自定义流
function RR() {}
RR.prototype = Object.create(new Readable());
RR.prototype._read = function (data) {}

if (ctx.request.url === '/sse') {
    // 设置响应头
    ctx.set({
      // 类型必须为event-stream
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    })

    let stream = new RR()
    let count = 1
    stream.push(`event: test1\ndata: ${JSON.stringify({ count: count })}\n\n`)

    // 返回的消息格式有要求，这里返回流是因为koa特殊
    // 如果不是流会调用res.end(buffer)，结束HTTP响应
    ctx.body = stream

    // 多次主动响应，共用一个连接
    const timer = setInterval(() => {
      stream.push(`event: test1\ndata: ${JSON.stringify({ count: ++count })}\n\n`)
      if (count > 5) {
        clearInterval(timer)
      }
      ctx.body = stream
    }, 2000)
  }
```

返回的消息格式应包含这几个字段
```js
id: 1 // 事件id
event: test1 // 自定义事件，不设置则默认为message
data: {count: 1} // 数据
retrey : 10000 // 重连时间
```

- 成果图

![](https://ws2.sinaimg.cn/large/006tNc79gy1ftmhg2g1wbj30za0zygrd.jpg)

与前两者一样基于HTTP协议，相比于长轮询，不需要客户端后续请求，只需要维持一个请求，后续服务端主动推送，且实现也比较简单。

具体代码见 [github](https://github.com/derekeeeeely/dz-FE)


### webSocket

webSocket是有别于HTTP的一种新协议，诞生已有十年之久。webSocket握手阶段采用HTTP协议，没有同源限制，标识符为ws

- 客户端

```js
// 原生写法
const ws = new WebSocket('ws://127.0.0.1:5001')
ws.readyState 0 正在连接 1 已连接 2 正在关闭 3 已关闭
ws.onopen = (evt) => {
  console.log('opened')
  ws.send('hello from client')
}
ws.onmessage = (evt) => {
  console.log(`from server: ${evt.data}`)
  ws.close()
}
// socket.io-client
// 服务端用的socket.io，客户端不用相应的client会有问题
const ws = io('ws://127.0.0.1:5001');
ws.on('connect', (evt) => {
  console.log('opened')
  ws.send('hello from client')
})
ws.on('message', (evt) => {
  console.log(`from server: ${evt}`)
  ws.close()
});
ws.on('disconnect', () => { });
```
- node server

```js
// with koa
const server = require('http').createServer(app.callback())
const io = require('socket.io')(server)
io.on('connection', (socket) => {
  console.log('connected')
  socket.on('message', (msg) => {
    console.log(msg)
    io.emit('message', 'hello from server');
  });
});
server.listen('5001')
```

使用起来非常简单，在单个TCP连接上实现客户端和服务端之间的全双工通信，性能在几者中最好，后续想写聊天室玩的时候再来搞搞。

## 总结

web即时通讯其实要解决的一个是性能问题，一个是效率问题。性能上像长轮询和短轮询都是比较差的，效率我理解体现在实时性和主动性上。长连接和websocket都可以实现服务端主动推送，websocket实现的是双方你来我往的双工通信，更适用于即时通讯的场景。具体做这方面东西肯定会碰到一些坑的，这里浅尝辄止，以后有机会接触再做深入。