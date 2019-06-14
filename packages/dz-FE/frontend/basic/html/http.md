# 网络基础

## 网络层级

![20170516149490559398728.png](http://opo02jcsr.bkt.clouddn.com/20170516149490559398728.png)

- 实体层（物理层）：连接计算机（光纤、电缆线、无线电波、双绞线等）。

- 链接层（数据链路层）：确定0 1的分组形式。

	- 以太网协议

      一组电信号组成一帧，一帧分为head和data两部分，head中包含接收方MAC地址信息，以广播的方式向本网络内所有计算机发送数据包，由接收方自己比对MAC地址判断是否接收。

- 网络层：主机到主机的通信。

	- 互联网由许多子网络组成，在同一子网中可以通过MAC地址以广播形式找到目标，但是不同子网广播不过去，所以需要在网络层引入新的地址用于查找子网络，即网址。
	- IP协议

      IPV4规定网络地址由32个二进制位组成，以IP地址与子网掩码相加是否相等判断是否位于同一个子网络。IP数据包放入到以太网数据包的data部分，IP数据包同样包含head和data两部分。
	- ARP协议

      通过IP地址获取MAC地址（不在同一子网交由网关处理），在同一个子网络中广播发出数据包包含目标IP地址，MAC地址为FF:FF:FF:FF:FF:FF目标主机接收到后比对成功后报告自己的MAC地址，于是获取到了MAC地址，可以把数据包发送到子网络里任一主机。

- 传输层：端口到端口的通信。（端口为每个使用网卡的程序的编号）

	- UDP协议

      数据包放入到IP数据包的data中，同样由head和data组成，head主要定义发出端口和接收端口，data为具体内容。
	- TCP协议

      有确认机制的UDP，每个数据包需要确认，过程复杂，消耗更多的资源。

- 应用层：规定应用程序的数据格式。（DHCP,DNS,HTTP,FTP,SSH等）

![20170516149490921439572.png](http://opo02jcsr.bkt.clouddn.com/20170516149490921439572.png)

## 用户角度


- 网络通信是主机间数据包交换，要交换数据需要知道双方的MAC地址和IP地址。
- 用户可以通过静态IP和动态IP两种方式实现网络通信配置。

	- 设置本机静态IP、子网掩码从而确定本机所处子网络，设置网关用于跨子网通信，设置DNS服务器地址用于DNS解析。
	- 利用DHCP协议，以广播形式向DHCP服务器获取动态的IP地址。

- 实例：访问页面。

	- 浏览器中输入URL，从本地（浏览器->OS）DNS缓存中获取目标服务器IP地址，本地没有则向DNS服务器请求，获取到IP地址后缓存到本地。
	- 判断是否为同一子网络，是则数据包应包含本机和目标主机的MAC、IP地址，否则目标主机的MAC地址应改为网关MAC地址。
	- 组装数据包，如上图。
	- 建立TCP连接，经历三次握手后在第三次将数据包发送到目标服务器，服务器取出完整的TCP数据包后做处理，定位资源，将资源复本写到TCP套接字做出HTTP响应，然后借由TCP协议再发送回来到客户端。
	- 客户端收到响应，进行页面处理、展示。

## HTTP

### 基础

应用层协议，无状态。

- 请求/响应模型

  客户端向服务端发送请求，服务端根据接收到的请求，处理后向客户端返回响应信息。

  ![](https://ws2.sinaimg.cn/large/006tKfTcgy1ftg105cqzuj30sq0actg6.jpg)

- url

  ``
  协议类型:[//[访问资源需要的凭证信息@]服务器地址[:端口号]][/资源层级UNIX文件路径]文件名[?查询][#片段ID]
  ``

  用于定位资源，输入url->客户端展示的过程不再赘述

- 请求/响应结构

  - 请求：请求行、请求头、请求正文(只有POST有)
  - 响应：状态行、响应头、响应正文
  - 头域：重点关注缓存相关，这里不赘述

  > get和post区别在于前者参数在url后，后者在请求正文；前者有大小限制，后者无，后者有请求体，前者无

  > 关于状态码，一般来说简单记忆如下：1XX 可续发 2XX 成功 3XX 重定向 4XX 客户端错误 5XX 服务端错误

### HTTP1.1

- 长连接

  ```
  // 请求头、响应头中包含
  Connection: keep-alive
  ```

  1.1默认开启长连接，使得连接在一段时间内维持开启，后续请求可复用，减少建立连接的成本

- 协议升级

  ```
  // 请求头中包含
  Connection: Upgrade
  Upgrade: websocket
  ```

  升级为websocket协议，后续会谈到

- 缓存控制

  ![cache-rule](http://opo02jcsr.bkt.clouddn.com/7-19-2018,-1:10:19-PM.png)

  - 1.0的expires -> 1.1的cache-control

    后者是相对时间，两者都存在时，以后者为判断过期依据(浏览器判断)

  - Etag与Last-Modified

    如果上次返回头中有Etag，则带上if-none-match信息请求到服务端，服务端进行判断Etag是否修改，选择304/200

    如果上次返回头中有Last-Modified，则带上if-modified-since信息请求道服务端，服务端判断是否失效，返回304/200

- 痛点
    - 明文传输，不安全
    - header过大，且很多时候header变化不大，资源浪费
    - keep-alive给服务端带来性能问题

- 需优化点
  - 带宽
    - pay more
  - 延迟
    - DNS解析：解决：预解析与缓存。
    - 建立连接消耗：基于TCP，每次建立连接都需要经历三次握手，最快也要在第三次才能将报文发送到服务端。解决：keep-alive/HTTP2
    - 浏览器阻塞：由于浏览器单域名下最大连接限制(6个)，达到限制后会导致后续请求阻塞，解决：将域名分区，提高并行资源下载能力；合并资源，减少请求个数。

### HTTPS

#### 图解

  ![](http://opo02jcsr.bkt.clouddn.com/7-20-2018,-2:01:35-PM.png)

  HTTPS运行在SSL/TLS上，SSL/TLS运行在TCP上，所有传输内容都是需要加密的，可以有效防劫持

  ![](http://opo02jcsr.bkt.clouddn.com/7-20-2018,-3:56:14-PM.png)

  握手阶段：
  - 客户端给出协议版本、客户端生成的随机数、支持的加密方法
  - 服务端收到后确认加密方法，返回数字证书，以及一个服务端生成的随机数
  - 客户端确认证书有效，生成一个随机数，用证书汇总的公钥加密随机数，发送给服务端
  - 服务端使用私钥获得客户端发送的随机数
  - 根据约定的加密算法，使用前面的三个随机数生成会话密钥，用来加密后续整个会话过程

  加密解密
  - 公钥和私钥只用于加密/解密 对话密钥（非对称）
  - 安全与否取决于三个随机数中的第三个能否被破解

  对称加密/非对称加密
  - 使用一对密钥，公钥用来加密，私钥不公开，用于解密，慢，但是更安全 ----> 非对称加密
  - 密钥在网络中传输，快但是不安全 ----> 对称加密
  - 解决：用非对称加密的公钥加密对称加密的密钥，接收方用私钥解密得到对称密钥，用于加密信息（减少复杂度，降低服务器压力）

#### 升级至HTTPS

- github免费的github pages用来搭建个人博客非常方便，感兴趣的可以参考[这里](https://juejin.im/post/59f16b165188255e6e35cc38)

  在项目设置下选择开启HTTPS即可

  ![](http://opo02jcsr.bkt.clouddn.com/7-20-2018,-1:22:32-PM.png)

  小绿锁很醒目

  ![](http://opo02jcsr.bkt.clouddn.com/7-20-2018,-1:25:25-PM.png)

- 个人站点升级HTTPS
  - 从域名服务商获取免费的SSL证书

    ![](http://opo02jcsr.bkt.clouddn.com/7-20-2018,-1:33:50-PM.png)

    按照流程填写

    ![](http://opo02jcsr.bkt.clouddn.com/7-20-2018,-1:34:23-PM.png)

  - 下载证书到服务器(我的是一年免费的谷歌gce)
  - 修改nginx配置

    ```nginx
    server {
        listen 80;
        server_name pandora.derekz.cn;
        # 重定向到https
        rewrite ^(.*)$  https://$host$1 permanent;

        location / {
            root html;
            index index.html index.htm;
        }
    }
    server {
        # 顺便换http2吧
        listen 443 ssl http2;
        server_name pandora.derekz.cn;
        root html;
        index index.html index.htm;

        # 你的证书路径
        ssl_certificate   /etc/nginx/cert/xxxxxxx.pem;
        ssl_certificate_key  /etc/nginx/cert/xxxxxxx.key;

        ssl_session_timeout 5m;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_prefer_server_ciphers on;
    }
    ```
  - 重启nginx，稍稍等待访问[个人网站](https://pandora.derekz.cn)

    ![](http://opo02jcsr.bkt.clouddn.com/7-20-2018,-1:38:25-PM.png)

### HTTP2

#### SPDY

SPDY与HTTP2区别在于前者强制使用SSL传输协议，以及两者在首部算法上有所区别，SPDY出现于HTTP2前，特点与HTTP2类似：多路复用、服务器推送、头部压缩等。这里暂不讨论。

#### 核心——二进制分帧

- HTTP2采用完全二进制的格式传输数据。二进制数据在网络中传输单位一般为帧
- 一个帧包含有：类型Type、长度Length、标记Flag、流标识Stream和Frame payload（帧有效载荷）
- 多个帧形成帧的传输网络流，可以认为HTTP2是流式传输。

![](http://opo02jcsr.bkt.clouddn.com/7-20-2018,-4:30:14-PM.png)

- 不改变HTTP的语义，方法、首部、动词都不受影响
- 在应用层(HTTP2.0)和传输层(TCP)之间多了一个二进制分帧层
- 将请求的内容分割为帧，头部信息放入headers帧，body放入data帧
- HTTP2.0所有的通信都在一个连接上完成，每个数据流以消息形式发送，一个消息包含一个或多个帧，可以乱序，到达目的地后根据帧首部的流标识符重组

#### 首部压缩

- 客户端和服务器端使用“首部表”来跟踪和存储之前发送的键-值对
- 如果首部不发生变化，那么首部0开销，此时首部自动使用之前请求的首部
- 如果发生变化，只需要将变化的部分填入首部，同时更新两端维护的首部表即可
- 于是，并不会有分帧后多加了很多首部帧带来的性能问题，反而提升了性能
- 合并资源减少请求并不适用与HTTP2，因为都在一个连接上

#### 双向并行

![](http://opo02jcsr.bkt.clouddn.com/7-20-2018,-5:17:22-PM.png)

不需要域名分区，因为不限制，而且可以双向并行多个请求/响应

HTTP2的多路复用与1.x的keep-alive本质上有区别，一个位于传输层，一个位于应用层，且后者是串行的，前者允许多个文件传输帧在图个TCP连接中同时流式传输

#### 服务端推送

```nginx
location / {
  root   /usr/share/nginx/html;
  index  index.html index.htm;
  http2_push /style.css;
  http2_push /example.png;
}
```

`http2_push`字段，只请求了/index.html 却返回了style.css等额外数据。待研究


#### 迁移HTTP2

细心的小伙伴也许发现了上面的nginx conf文件内有这么一行

  ```
  listen 443 ssl http2;
  ```
从HTTPS迁移到HTTP2非常简单，只需要修改nginx配置即可，最后打开chrome可以看到http2的连接情况

![](http://opo02jcsr.bkt.clouddn.com/7-20-2018,-4:28:07-PM.png)


## 思考

我们说一个网页的性能多好，最直接的一个表现是从enter敲下到页面展示花的时间多短，也就是我们追求的低延迟高带宽。带宽随着网络基础建设不断提高，所以性能瓶颈主要在于低延迟的难实现。

想想看，我们又要DNS解析，又要建立连接，还要加密解密，历经千难万险才能把请求信息送到服务器上。完了以后那一头的人还得礼尚往来，这之间每个步骤都是我们实现低延迟的障碍，也是我们优化的方向。

比如DNS预解析、HTTP2的多路复用使用一条连接、头部压缩、对称加密+非对称加密、缓存策略等等。理解这样一个过程以后，要怎么做就得实际动手处理问题中积累经验啦。