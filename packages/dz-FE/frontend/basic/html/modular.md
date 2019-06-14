# 模块化

随着前端项目体积不断变大，模块化的问题变得尤为重要，如何以模块的形式组织好文件，如何解决全局污染的问题，前人已有所应对。

## CommonJS

### Node的模块载入

Node的模块分为两类，原生模块和文件模块，原生模块在node源码编译时被编译进了二进制文件，加载速度最快。文件模块则是动态加载，速度较慢。node对于模块进行了缓存，二次require时不会有重复开销。

#### [github](https://github.com/nodejs/node/blob/master/lib/internal/modules/cjs/loader.js) 源码片段

- node启动时原生模块Module已加载，执行入口文件时，调用`Module._load`方法
  ```js
  Module.runMain = function () {
    // node index.js 主文件模块加载
    Module._load(process.argv[1], null, true);
  };
  ```

- `_load`分析文件名后，new一个module，并对入口文件模块进行缓存，调用`load`方法根据文件后缀选择不同的加载方式
  ```js
  var module = new Module(id, parent)

  Module._cache[filename] = module

  module.load(filename);
  ```

- 加载模块，调用`_compile`方法，对模块内容进行wrap

  ```js
  // wrap做的事情
  Module.wrap = function(script) {
    return Module.wrapper[0] + script + Module.wrapper[1];
  };
  Module.wrapper = [
    '(function (exports, require, module, __filename, __dirname) { ',
    '\n});'
  ];
  ```

- 包裹后返回的函数传入module对象的require,exports方法和module及文件、目录参数执行(这就是为什么我们可以随意用require和module.exports)
  ```js
  Module.prototype._compile = function(content, filename) {
    // content为文件内容
    var wrapper = Module.wrap(content);

    // vm.runInThisContext类似于eval，但是有明确的上下文，返回一个function
    var compiledWrapper = vm.runInThisContext(wrapper, {
      filename: filename,
      lineOffset: 0,
      displayErrors: true
    });
    // 返回
    return compiledWrapper.call(this.exports, this.exports, require, this, filename, dirname)
  }
  ```

- 我们在入口文件内用来引入别的文件模块的require
  ```js
  Module.prototype.require = function(id) {
    return Module._load(id, this, /* isMain */ false);
  };
  ```

- 然后就回到第二步啦，继续愉快地去加载别的模块吧~

#### require文件查找策略

- if in 文件模块缓存区 end else goto 2
- if 原生模块 goto 3 else goto 4
- if in 原生模块缓存区 end else goto 4
- find 加载原生/文件模块 goto 5
- cache 模块 end

#### module path

- module path指的是根据require时传入的值计算出来的文件模块的位置

  ```js
  // const a = require(module_path)
  console.log(module.paths)
  [ '/Users/derekely/derek/dz/dz-fe/frontend/basic/html/node_modules',
  '/Users/derekely/derek/dz/dz-fe/frontend/basic/node_modules',
  '/Users/derekely/derek/dz/dz-fe/frontend/node_modules',
  '/Users/derekely/derek/dz/dz-fe/node_modules',
  '/Users/derekely/derek/dz/node_modules',
  '/Users/derekely/derek/node_modules',
  '/Users/derekely/node_modules',
  '/Users/node_modules',
  '/node_modules' ]
  ```

  简而言之，如果是绝对路径不会按照层级一个个查，否则要按照层级结合缓存进行查找（package.json里的main字段可以指定文件，方便查找）

  emmmm这里的过程其实还不太简单，但是没兴趣了解了，以后再说

#### 包结构

- 顶级目录下的package.json
- 二进制文件在bin目录下，js文件在lib目录下
- 文档在doc目录下，测试在test目录下

#### 简单评价

CommonJS规范算是较早的js模块化规范，且node的模块化实现得比较好，模块相互独立不彼此影响，引入方式又简单便捷，可以说是很厉害了。

## AMD

AMD(Asynchronous Module Definition) 异步模块定义

刚刚说完的CommonJS规范下的模块加载是同步的，对于Node来说文件存在硬盘里是足够的，但对于前端赖以生存的浏览器来说，js通过标签引入，通过请求获取，天生异步，用CommonJS规范是会有问题的。

### RequireJS

RequireJS是实现了AMD规范的工具库，是异步的模块加载解决方案，主要用于客户端的模块管理。

```html
// data-main 指定主代码所在脚本
<script data-main="scripts/main" src="scripts/require.js"></script>
```

#### `define(id, [deps], cb)`定义模块

- 独立模块
  ```js
  define(() => {
    // 返回不局限
    return {
      method: function() {}
    }
  })
  ```
- 非独立模块
  ```js
  define(['a', 'b'], (a, b) => {
    // 该函数参数为依赖的模块
    // 必须返回一个对象
    return {
      methodA: a.method,
      methodB: b.method
    }
  })
  // another 写法
  define((require) => {
    var a = require('a')
    var b = require('b')
    return {
      methodA: a.method,
      methodB: b.method
    }
  })
  ```

#### `require([moddule], cb, errcb)`加载模块

- 写法和define很类似
  ```js
  require(['a', 'b'], (a, b) => {
    return {
      method: a.method
    }
  })
  ```
- 动态加载
  ```js
  // 在定义模块时使用require
  define(( require ) => {
    const isReady = false
    // 加载完a以后改变isReady值
    require(['a'], (a) => {
        isReady = true
    })
    return {
      isReady: isReady,
      a: a
    }
  })
  ```
#### RequireJS配置

略

#### 简单评价

可以满足浏览器模块加载的需要，不像很久以前先后依赖顺序没法保证，而且可以并行加载多个模块，但是需要在使用前提前加载所有模块，不是很优雅。

## CMD

CMD(Common Module Definition) 通用模块定义 由阿里的大佬玉伯提出，对应的浏览器端实现库为大佬的sea.js

### sea.js

sea.js与requirejs要做的事情其实是一致的，但两者在模块定义方式和加载时机上有所区别

#### define

相比于AMD在定义时将依赖写在前面，由于回调函数参数为依赖，可以理解为提前声明的模块被提前加载了

CMD选择就近声明，在需要的时候再加载
```js
// cmd定义模块
define((require, exports, module) => {
  const a = require('a')
  const b = a.method()
  // exports导出
  exports.r = b;
})
```

#### use

```js
seajs.use(['a.js'], (my) => {
  console.log(my.r)
})
```

#### 简单评价

与RequireJS相比，依赖就近，需要时再加载，看起来更优雅一些。

## ES6 Module

每个ES6模块是一个单独的文件，代码运行于严格模式和模块作用域内，可以使用`import`和`export`关键字。

### 目的

ES6的模块化设计的目的之一是为了静态化，能够在编译时确定模块的依赖关系，从而方便进行代码分析、tree shaking优化。

此外，ES6的Module，旨在提供一种有别于社区的能够同时满足客户端和服务端js模块化需要的官方标准，目前确实已经比较方便了。

### 语法

- export
  ```js
  // 定义模块的对外接口
  const a = 1
  const m = 2
  export c = 3
  export { a as b, m as n }
  // 指定默认输出
  // 等价于 export { default as a }，所以default后不能为声明语句
  export default a = 1
  // 等价于给default赋值4
  export default 4
  ```
- import

  `import`在编译时执行，会被提升到模块顶部
  ```js
  import { b as c } from './a.js'
  // 整体加载
  import * from './a.js'
  // a.js默认输出a时不需要大括号
  import a from './a.js'
  ```

  由于是编译时执行，无法做到在运行时根据运行结果动态加载(有提案import()用于运行时加载，这个且略过)

### ES6 VS CommonJS

- 前者为编译时输出接口，后者为运行时加载
- 前者输出的只读引用，脚本执行时需要找到模块取值，而后者是在加载完后输出一个值的拷贝，是一个实际的对象

### Node加载ES6模块
