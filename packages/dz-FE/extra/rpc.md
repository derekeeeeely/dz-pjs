- new client
  - registryConfig
    ![](http://opo02jcsr.bkt.clouddn.com/9-13-2018,-11:38:05-AM.png)
  - referenceConfig
    ![](http://opo02jcsr.bkt.clouddn.com/9-13-2018,-11:37:41-AM.png)
  - consumerConfig
    ![](http://opo02jcsr.bkt.clouddn.com/9-13-2018,-11:39:00-AM.png)
  - routerServer
    ![](http://opo02jcsr.bkt.clouddn.com/9-13-2018,-11:40:08-AM.png)

- client.init
  - initNormalConsumer

  // 根据各区zk，生成包含多个zk client的comsumer
  - new Consumer
    - createRegistry
      - new ZookeeperRegistry
        - this.zkClient = this.createClient(this.address)
        - ZookeeperClient.createClient(address)

  // 根据referenceConfig为每个ref生成远程调用服务对象代理
  - this.referenceConfig.map(config => this.consumer.getReference(config.id))

  // step1 注册znode (init monitor，这就是为啥日志有两次记录)
    - const consumerURL = new URL({...})
    - const providerSearchURL = new URL({...}) // provider搜索url
    - await registry.register(consumerURL)
      - doRegister(url)

        - const urlPath: string = this.toUrlPath(url)
        ```js
        /dubbo/com.alibaba.dubbo.monitor.MonitorService/consumers/consumer%3A%2F%2F192.168.103.204%2Fcom.alibaba.dubbo.monitor.MonitorService%3Fapplication%3D%255Bobject%2520Object%255D%26category%3Dconsumers%26check%3Dfalse%26default.loadbalance%3Drandom%26default.timeout%3D1000%26dubbo%3D2.5.3%26interface%3Dcom.alibaba.dubbo.monitor.MonitorService%26noob%3D0.1.44%26pid%3D19391%26side%3Dconsumer%26timestamp%3D1536820617876
        ```
        - const parts = urlPath.split(Constants.PATH_SEPARATOR)
        ![](http://opo02jcsr.bkt.clouddn.com/9-13-2018,-2:47:25-PM.png)
        - await this.connect() // 确保连接，race 15000ms
        - await this.createDir(parts[2]) // 确保目录存在
        - this.zkClient.create(urlPath, 1, (err, node) => { this.registered.add(url.toFullString()) }) // 创建znode，断开连接znode删除(临时node)

        ![](http://opo02jcsr.bkt.clouddn.com/9-13-2018,-4:10:28-PM.png)

        ![](http://opo02jcsr.bkt.clouddn.com/9-13-2018,-4:13:03-PM.png)

        ![](http://opo02jcsr.bkt.clouddn.com/9-13-2018,-4:13:12-PM.png)

  // step2 get invoker
    - const invokers = await this.getInvokers(providerSearchURL, registry) // 首次获取到的都是[]
    - const reference = new Reference(referenceConfig, this.config, invokers, filter) // create reference
    - await this.subscribe(reference, registry, providerSearchURL) // 订阅ref，更新invokers

      ```js
      registry.subscribe(providerSearchURL, async providers => {
        const oldInvokers = reference.getInvoker()
        const invokers = await this.getInvokers(providerSearchURL, registry, providers)
        reference.setInvoker(invokers)
        for (const [, invoker] of oldInvokers) {
          invoker.destroyed()
        }
      })
      ```
      ![](http://opo02jcsr.bkt.clouddn.com/9-13-2018,-4:27:11-PM.png)
    - client.reference
      ```js
      return Promise.all(this.referenceConfig.map(config => this.consumer.getReference(config.id)))
        .then(references => {
          references.map(ref => Client.reference.set(ref.config.id, ref))
        })
      ```
      ![](http://opo02jcsr.bkt.clouddn.com/9-13-2018,-4:34:10-PM.png)
  // update invoker
  - getInvokers
    - const protocols = this.getProtocol(providers) // create protocols for each provider
      ```js
      const dubboProtocol = new DubboProtocol(new ProtocolConfig({
        id: 'dubbo://192.168.1.146:36480',
        name: 'dubbo',
        host: '192.168.1.146',
        port: 36480,
      }))
      ```

      ![](http://opo02jcsr.bkt.clouddn.com/9-13-2018,-4:44:41-PM.png)
    - invokers = new Map()
      ```js
      for (const [id, protocol] of protocols) {
        try {
          const invoker: Invoker = await protocol.ref(url)
          await invoker.client.connectToRemote()
          invokers.set(invoker.id, invoker)
        } catch (e) {
          LogFactory.logger.warn(`[NOOB] Create invoker failed: ${url.getServiceInterface()}\n`, e)
        }
      }

      public async ref(url: URL): Promise<Invoker> {
        const invoker = await this.createInvoker(url)
        invoker.origin = this.origin
        return invoker
      }
      ```
    - DubboProtocol.createInvoker
      ```js
      // client是否已存在
      if (!this.client || !this.client.isAvaliable()) {
        this.client = new DubboClient(this.host, this.port) as DubboClient
        // await this.client.connectToRemote()
        this.client.connectToRemote().catch(e => LogFactory.logger.warn(`[NOOB] CONNECTING -> ${e}@${url.getParameter('interface')}`))
      }
      // 根据client和url返回invoker对象
      return new DubboInvoker(this.client, url)
      ```
      invoker长这样，有一个random的id
      ![](http://opo02jcsr.bkt.clouddn.com/9-13-2018,-4:54:18-PM.png)
      dubboinvoker继承自AbstractInvoker
      ```js
      // invoke方法
      public async invoke(method: string, args: any[], config: any): Promise<any> {
        let result
        await compose(config.filter.concat(async (context, next) => {
          if (this.mock.has(method)) {
            const mock = this.mock.get(method)
            LogFactory.logger.info(`[NOOB] ${mock.prefix}${Constants.MOCK_KEY} -> ${this.interface}${this.version}.${method}: ${mock.expression}`)
            result = await mock.invoke.call(null)
          } else {
            // doInvoke
            result = await this.doInvoke(method, args, {
              timeout: config.timeout,
            })
          }
        }))({
          method,
          args,
          invoker: this,
        })
        return result
      }

      ```
      // doinvoke
      ```js
      protected async doInvoke(method: string, args: any[], config: any): Promise<any> {
        const inv: Invocation = new Invocation({
          method,
          args,
          interface: this.interface,
          version: this.version,
          group: this.group,
          timeout: config.timeout,
        })
        return await this.client.request(inv)
      }
      ```
      // invocation对象
      ![](http://opo02jcsr.bkt.clouddn.com/9-13-2018,-5:07:07-PM.png)
      // AbstractClient.request
      ```js
      public async request(inv: Invocation): Promise<Result> {
        const ctx = new Context()
        // socket连接
        const socket = await this.getSocket()
        ctx.invocation = inv
        // ctx.timer = setTimeout(
        //   () => {
        //     ctx.deferred.reject(new Error(`NOOB_REQUEST_TIMEOUT_ERROR: Request timeout at ${inv.timeout}ms, Invocation is ${inv}`))
        //     this.contexts.delete(inv.id)
        //   },
        //   inv.timeout
        // )
        // id 上下文
        this.contexts.set(inv.id, ctx)
        // invocation对象传入，encode
        // 详见dubbocodec.ts
        socket.write(this.codec.requestEncode(inv))
        ctx.timer = setTimeout(
          () => {
            ctx.deferred.reject(new Error(`NOOB_REQUEST_TIMEOUT_ERROR: Request(${socket.remoteAddress}:${socket.remotePort}) timeout at ${inv.timeout}ms, Invocation is ${inv}`))
            process.nextTick(() => this.contexts.delete(inv.id))
          },
          inv.timeout
        )
        return ctx.deferred.promise
      }
      ```

- 小结

  - 传入配置，创建zk client
  - 根据references到相应zk创建znode
  - 监听znode信息变更，更新invokers
  - invokers是包含了服务地址和invoke方法及其他细节的对象
  - 调用服务时使用sokect进行数据传输


- 调用时
  - xxx.js内生成了referenceId
    ```js
    const __referenceId__ = 'com.dianwoda.rider.lottery.config.provider.LotteryConfigProvider'
    ```
    invoke
    ```js
    __reference__.invoke('page', __Proxy__.methodParameterTranfomerFactory({"name":"com.dianwoda.rider.lottery.config.dto.LotteryConfigPageInDTO","isPrimitive":false,"isArray":false,"isGeneric":false}, {"name":"java.lang.String","isPrimitive":false,"isArray":false,"isGeneric":false})(Array.from(arguments)))
    ```
    参数转换由proxy.ts完成
    ```js
    methodParameterTranfomerFactory ->
    makeField ->
    makeDto
    ```
    选取invoker
    ```js
    const invoker = this.selectInvoker(methodConfig.loadbalance || this.loadbalance || this.consumerConfig.loadbalance, method)
    ```
    AbstractInvoker.invoke

    DubboInvoker.doInvoke

    到这里的参数长这样
    ![](http://opo02jcsr.bkt.clouddn.com/9-13-2018,-5:40:19-PM.png)
    AbstractClient.request
      - 通过socket进行通信
      - this.socket.on('data', this.onData.bind(this))
      - onData -> this.response(buf.slice(0, total))
      - response -> const res = this.codec.responseDecode(buf)
      - ctx.result = res
      - ctx.deferred.resolve(ctx.result.value)

- 小结
  - proxy.methodParameterTranfomerFactory转参数
  - reference.invoke选取invoker
  - AbstractInvoker.invoke
  - DubboInvoker.doInvoke
  - AbstractClient.request
  - return res