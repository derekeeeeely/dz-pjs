module.exports = class ServiceB {
  constructor(context) {
    this.context = context;
  }
  async start() {
    // 或者 require('pandora').getProxy();
    const serviceA = await this.context.getProxy("serviceA");
    const serviceC = await this.context.getProxy("serviceC");
    const testC = await serviceC.test()
    const pid = await serviceA.getPid();
    console.log();
    console.log();
    console.log("pid from serviceA", pid);
    console.log("pid from serviceB", process.pid);
    console.log("test for c", testC)
    console.log();
    console.log();
  }
  async stop() {
    console.log("ServiceB called stop");
  }
};
