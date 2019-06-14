# web安全基础

## 三大攻击

XSS(cross site script, 跨站脚本攻击)，SQL注入和CSRF(cross-site request forgery, 跨站请求伪造)是最常见的几种web攻击行为

### XSS

由带有页面可解析内容的数据未经处理直接插入到页面解析导致

- 存储型XSS

  后台从数据库中读取数据返回，在前端页面模板中直接渲染
  ```html
  <div>{{ content }}</div>
  <!-- content ---> <script>alert(1)<script> -->
  <!-- 渲染后 -->
  <div><script>alert(1)<script></div>
  ```
- MXSS(Dom XSS)

  将脚本插入Dom属性中被解析导致
  ```html
  <div class="abcd {{ content }}"></div>
  <!-- content ---> "><script>alert(2)</script><div class="efgh -->
  <!-- 渲染后 -->
  <div class="abcd"><script>alert(2)</script><div class="efgh"></div>
  ```

- 反射性XSS

  在url中注入了可解析内容，页面渲染时用到了这些参数导致
  ```js
  // 例如node服务器处理页面请求时
  let name = req.query['name']
  // name=<script>alert(3)<script>
  this.body = `<div>${name}</div>`
  // 渲染后
  <div><script>alert(3)<script></div>
  ```

一般处理方式：
- HTML编码：将特殊字符如`<`, `>`等进行转换，转换为HTML字符实体
- js编码：使用Unicode码位替换特殊字符
- Url编码：%加ASCII码

具体的东西有点多啊，暂时先放放，以后对安全竞赛感兴趣了再补充

### CSRF

伪站点从源站点获取了用户信息后直接调用服务接口。
一般的处理的方式是通过服务下发加密过的token，并在后续请求中由前端带上到服务端进行token验证。但这样也不一定安全。

### SQL注入

一个例子：

  ```js
  // 请求url GET /xxx/xxx?id=100 or name=derek
  // server
  sql = `select * from user where id =${req.query.id}`
  exec(sql)
  // 得到了意料之外、预谋已久的信息
  ```
一般处理方式是服务端对于参数进行校验

## 请求劫持

### DNS劫持

顾名思义，DNS服务器(DNS解析各个步骤)被篡改，修改了域名解析的结果，使得访问到的不是预期的ip

### HTTP劫持

![](http://opo02jcsr.bkt.clouddn.com/7-23-2018,-8:32:38-PM.png)

运营商劫持，此时大概只能升级HTTPS了

## 浏览器安全控制

- X-XSS-Protection

  防止反射型XSS
- Strict-Transport-Security

  强制使用HTTPS通信
- Content-Secure-Policy

  指定浏览器只可以加载指定可信域名来源的内容，可以在响应头中返回，也可在页面meta标签内指定
  ```html
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src https://*; child-src 'none';">
  ```
- Access-Control-Allow-Origin

  设置可访问该服务器资源的域