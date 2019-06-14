## 开始之前

- 同步和异步

  ```js
  function sync(){
    const doA = '12'
    const doB = '34'
  }
  function async(){
    ajax('/api/doC1', (res) => {
      doC2(res)
    })
  }
  ```
  同步很好理解，任务一个个执行，doA以后才能doB。

  异步任务可以理解为分两个阶段，doC的前一阶段是发出请求，后一阶段是在请求结束后的未来时刻处理。

  两者各有优劣，同步任务会导致阻塞，异步任务需要由有机制实现前后两部分的分离，使得主线程能够在这间歇内继续工作而不浪费时间等待。

  以浏览器为例大致过程：

  主线程调用web api，通过工作线程发起请求，然后主线程继续处理别的任务(这是part1)。工作线程执行完了异步任务以后往事件队列里注册回调，等待主线程空闲后去队列中取出到主线程执行栈中执行(这是part2)。
- 并发和并行

  ![](http://opo02jcsr.bkt.clouddn.com/8-7-2018,-3:57:01-PM.png)

  简单描述：并发是交替做不同事情，并行是同时做不同事情。

  我们可以通过多线程去处理并发，但说到底CPU只是在快速切换上下文来实现快速的处理。而并行则是利用多核，同时处理多个任务。

- 单线程和多线程

  我们总说js是单线程的，node是单线程的，其实这样的说法并不完美。所谓单线程指的是js引擎解释和执行js代码的线程是一个，也即是我们常说的主线程。

  ![](http://opo02jcsr.bkt.clouddn.com/8-7-2018,-3:57:53-PM.png)

  又比如对于我们熟悉的node，I/O操作实际上都是通过线程池来完成的，js->调用c++函数->libuv方法->I/O操作执行->完毕后js线程继续执行后续。

## lesson1 Promise

### callback

  ```js
  ajax('/a', (res) => {
    ajax('/b, (res) => {
      // ...
    })
  })
  ```
  丑陋的callback形式，不再多说

### 你的名字

- `Promise` 诞于社区，初为异步编程之解决方案，后有ES6将其写入语言标准，终成今人所言之 `Promise` 对象
- Promise对象特点有二：状态不受外界影响、一旦状态改变后不会再次改变

### 基本用法

- Promise为构造函数，用于生成Promise实例
  ```js
  // 接收以resolve和reject方法为参数的函数
  const pr = new Promise((resolve, reject) => {
    // do sth
    resolve(1) // pending -> resolved
    reject(new Error()) // pending -> rejected
  })
  ```
- 使用then方法传入状态更改后的回调函数
  ```js
  pr.then((value) => {
    // onresolved cb
  }, (err) => {
    // onrejected cb
  })
  ```
### 我愚蠢的孩子们

- `Promise.prototype.then`

  采用链式写法，返回一个新的Promise，上一个回调的返回作为参数传递到下一个回调

- `Promise.prototype.catch`

  实际上是`.then(null, rejection)`的别名

  同样支持链式写法，最后一个catch可以catch到前面任一个Promise跑抛出的未catch的error

- `Promise.all`

  参数需具有Iterator接口，返回为多个Promise实例

  ```js
  var p = Promise.all([p1, p2, p3]);
  ```

  p1, p2, p3均resolve后p才resolve，任一个reject则p就reject。

  若内部有catch，则外部catch捕获不到异常。

- `Promise.race`

  ```js
  // 若5秒未返回则抛错
  const p = Promise.race([
    fetch('/resource-that-may-take-a-while'),
    new Promise(function (resolve, reject) {
      setTimeout(() => reject(new Error('request timeout')), 5000)
    })
  ]);
  p.then(response => console.log(response));
  p.catch(error => console.log(error));
  ```
  第一个状态改变的Promise会引起p状态改变。

- `Promise.resolve/reject`

  ```js
  Promise.resolve('1')
  Promise.resolve({ then: function() {
    console.log(123)
  } })
  ```
  - 不传参数/传非thenable对象，生成一个立即resolve的Promise
  - 传thenable对象，立即执行then方法，然后根据状态更改执行then(普通Promise行为)

- `Promise.prototype.finally`
  ```js
  Promise.prototype.finally = function (callback) {
    let P = this.constructor;
    return this.then(
      value  => P.resolve(callback()).then(() => value),
      reason => P.resolve(callback()).then(() => { throw reason })
    );
  };
  ```
  无论如何都会执行最后的cb

Promise为我们提供了优于callback嵌套的异步选择，但实际上还是基于回调来实现的。

### 实现

简单的Promise实现代码可以看这里 [github](promise.js)

## lesson2 Generator

### 初探

- 基本概念
  ```js
  function * gen() {
    const a = yield 1;
    return 2
  }
  const m = gen() // gen {<suspended>}
  m.next() // {value: 1, done: false}
  m.next() // {value: 2, done: true}
  m.next() // {value: undefined, done: true}
  m // gen {<closed>}
  ```
  - Generator一个遍历器生成函数，一个状态机
  - 执行返回一个遍历器，代表Generator函数的内部指针（此时yield后的表达式不会求值）
  - 每次调用遍历器的next方法会执行下一个yield前的语句并且返回一个`{ value, done }`对象。
  - 其中`value`属性表示当前的内部状态的值，是yield表达式后面那个表达式的值，`done`属性是一个布尔值，表示是否遍历结束
  - 若没有yield了，next执行到函数结束，并将return结果作为value返回，若无return则为undefined。
  - 这之后调用next将返回`{ value: undefined, done: true }`，Generator的内部属性`[[GeneratorStatus]]`变为closed状态

- `yield`
  - 调用next方法时，将yield后的表达式的值作为value返回，只有下次再调用next才会执行这之后的语句，达到了暂停执行的效果，相当于具备了一个惰性求值的功能
  - 没有yield时，Generator函数为一个单纯的暂缓执行函数（需要调用next执行）
  - yield只能用于Generator函数

### 方法

- `Generator.prototype.next()`

  通过传入参数为Generator函数内部注入不同的值来调整函数接下来的行为
  ```js
  // 这里利用参数实现了重置
  function* f() {
    for(var i = 0; true; i++) {
      var reset = yield i;
      if(reset) { i = -1; }
    }
  }
  var g = f();
  g.next() // { value: 0, done: false }
  g.next() // { value: 1, done: false }
  // 传递的参数会被赋值给i（yield后的表达式的值(i)）
  // 然后执行var reset = i赋值给reset
  g.next(true) // { value: 0, done: false }
  ```
- `Generator.prototype.throw()`
  - Generator函数返回的对象都具有throw方法，用于在函数体外抛出错误，在函数体内可以捕获（只能catch一次）
  - 参数可以为Error对象
  - 如果函数体内没有部署try...catch代码块，那么throw抛出的错会被外部try...catch代码块捕获，如果外部也没有，则程序报错，中断执行
  - throw方法被内部catch以后附带执行一次next
  - 函数内部的error可以被外部catch
  - 如果Generator执行过程中内部抛错，且没被内部catch，则不会再执行下去了，下次调用next会视为该Generator已运行结束
- `Generator.prototype.return()`
  - `try ... finally`存在时，return会在finally执行完后执行，最后的返回结果是return方法的参数，这之后Generator运行结束，下次访问会得到`{value: undefined, done: true}`
  - `try ... finally`不存在时，直接执行return，后续和上一条一致

以上三种方法都是让Generator恢复执行，并用语句替换yield表达式

### `yield*`

- 在一个Generator内部直接调用另一个Generator是没用的，如果需要在一个Generator内部yield另一个Generator对象的成员，则需要使用`yield*`
  ```js
  function* inner() {
    yield 'a'
    // yield outer() // 返回一个遍历器对象
    yield* outer() // 返回一个遍历器对象的内部值
    yield 'd'
  }
  function* outer() {
    yield 'b'
    yield 'c'
  }
  let s = inner()
  for (let i of s) {
    console.log(i)
  } // a b c d
  ```

- `yield*`后跟一个遍历器对象（所有实现了iterator的数据结构实际上都可以被`yield*`遍历）

- 被代理的Generator函数如果有return，return的值会被for...of忽略，所以next不会返回，但是实际上可以向外部Generetor内部返回一个值，如下：
  ```js
  function *foo() {
    yield 2;
    yield 3;
    return "foo";
  }
  function *bar() {
    yield 1;
    var v = yield *foo();
    console.log( "v: " + v );
    yield 4;
  }
  var it = bar();
  it.next()
  // {value: 1, done: false}
  it.next()
  // {value: 2, done: false}
  it.next()
  // {value: 3, done: false}
  it.next();
  // "v: foo"
  // {value: 4, done: false}
  it.next()
  // {value: undefined, done: true}
  ```

- 举个🌰
  ```js
  // 处理嵌套数组
  function* Tree(tree){
    if(Array.isArray(tree)){
      for(let i=0;i<tree.length;i++) {
        yield* Tree(tree[i])
      }
    } else {
      yield tree
    }
  }
  let ss = [[1,2],[3,4,5],6,[7]]
  for (let i of Tree(ss)) {
    console.log(i)
  } // 1 2 3 4 5 6 7
  // 理解for ...of 实际上是一个while循环
  var it = iterateJobs(jobs);
  var res = it.next();
  while (!res.done){
    var result = res.value;
    // ...
    res = it.next();
  }
  ```

### Extra

- 作为对象的属性的Generator函数

  写法很清奇
    ```js
    let obj = {
      * sss() {
        // ...
      }
    }
    let obj = ={
      sss: function* () {
        // ...
      }
    }
    ```

- Generator函数的this

  Generator函数返回的是遍历器对象，会继承prototype的方法，但是由于返回的不是this，所以会出现：
    ```js
    function* ss () {
      this.a = 1
    }
    let f = ss()
    f.a // undefined
    ```
  想要在内部的this绑定遍历器对象？
    ```js
    function * ss() {
      this.a = 1
      yield this.b = 2;
      yield this.c = 3;
    }
    let f = ss.call(ss.prototype)
    // f.__proto__ === ss.prototype
    f.next()
    f.next()
    f.a // 1
    f.b // 2
    f.c // 3
    ```

### 应用

- 举个🌰
    ```js
    // 利用暂停状态的特性
    let clock = function* () {
      while(true) {
        console.log('tick')
        yield
        console.log('tock')
        yield
      }
    }
    ```

- 异步操作的同步化表达
    ```js
    // Generator函数
    function* main() {
      var result = yield request("http://some.url");
      var resp = JSON.parse(result);
        console.log(resp.value);
    }
    // ajax请求函数，回调函数中要将response传给next方法
    function request(url) {
      makeAjaxCall(url, function(response){
        it.next(response);
      });
    }
    // 需要第一次执行next方法，返回yield后的表达式，触发异步请求，跳到request函数中执行
    var it = main();
    it.next();
    ```

- 控制流管理
    ```js
    // 同步steps
    let steps = [step1Func, step2Func, step3Func];
    function *iterateSteps(steps){
      for (var i=0; i< steps.length; i++){
        var step = steps[i];
        yield step();
      }
    }
    // 异步后续讨论
    ```

### 实现

TO BE CONTINUED

## lesson3 Generator的异步应用

回到最初提到的异步：将异步任务看做两个阶段，第一阶段现在执行，第二阶段在未来执行，这里就需要将任务 `暂停`。而前面说到的Generator似乎恰好提供了这么一个当口，`暂停`结束后第二阶段开启不就对应下一个next调用嘛！

想像我有一个异步操作，我可以通过Generator的next方法传入操作需要的参数，第二阶段执行完后返回值的value又可以向外输出，maybe Generator真的可以作为异步操作的容器？

### before it

#### 协程coroutine
  协程A执行->协程A暂停，执行权转交给协程B->一段时间后执行权交还A->A恢复执行
  ```js
  // yield是异步两个阶段的分割线
  function* asyncJob() {
    // ...其他代码
    var f = yield readFile(fileA);
    // ...其他代码
  }
  ```
#### Thunk函数

  - 参数的求值策略
    - 传名调用和传值调用之争
    - 后者更简单，但是可能会有需要大量计算求值却没有用到这个参数的情况，造成性能损失

  - js中的Thunk函数
    - 传统的Thunk函数是传名调用的一种实现，即将参数作为一个临时函数的返回值，在需要用到参数的地方对临时函数进行求值
    - js中的Thunk函数略有不同
        js中的Thunk函数是将多参数函数替换为单参数函数（这个参数为回调函数）
        ```js
        const Thunk = function(fn) {
          return function (...args) {
            return function (callback) {
              return fn.call(this, ...args, callback);
            }
          };
        };
        ```
        看起来只是换了个样子，好像并没有什么用

### 自执行

Generator看起来很美妙，但是next调用方式看起来很麻烦，如何实现自执行呢？

#### Thunk函数实现Generator函数自动执行

- Generator函数自动执行
    ```js
    function* gen() {
      yield a // 表达式a
      yield 2
    }
    let g = gen()
    let res = g.next()
    while(!res.done) {
      console.log(res.value)
      res = g.next() // 表达式b
    }
    ```
    但是，这不适合异步操作。如果必须保证前一步执行完，才能执行后一步，上面的自动执行就不可行。

    next方法是同步的，执行时必须立刻返回值，yield后是同步操作当然没问题，是异步操作时就不可以了。处理方式就是返回一个Thunk函数或者Promise对象。此时value值为该函数/对象，done值还是按规矩办事。
    ```js
    var g = gen();
    var r1 = g.next();
    // 重复传入一个回调函数
    r1.value(function (err, data) {
      if (err) throw err;
      var r2 = g.next(data);
      r2.value(function (err, data) {
        if (err) throw err;
        g.next(data);
      });
    });
    ```

- Thunk函数的自动流程管理

  - 思路：

    Generator函数中yield 异步Thunk函数，通过yield将控制权转交给Thunk函数，然后在Thunk函数的回调函数中调用Generator的next方法，将控制权交回给Generator。此时，异步操作确保完成，开启下一个任务。

    Generator是一个异步操作的容器，实现自动执行需要一个机制，这个机制的关键是控制权的交替，在异步操作有了结果以后自动交回控制权，而回调函数执行正是这么个时间点。
    ```js
    // Generator函数的执行器
    function run(fn) {
      let gen = fn()
      // 传给Thunk函数的回调函数
      function cb(err, data) {
        // 控制权交给Generator，获取下一个yield表达式（异步任务）
        let result = gen.next(data)
        // 没任务了，返回
        if (result.done) return
        // 控制权交给Thunk函数，传入回调
        result.value(cb)
      }
      cb()
    }
    // Generator函数
    function* g() {
      let f1 = yield readFileThunk('/a')
      let f2 = yield readFileThunk('/b')
      let f3 = yield readFileThunk('/c')
    }
    // Thunk函数readFileThunk
    const Thunk = function(fn) {
      return function (...args) {
        return function (callback) {
          return fn.call(this, ...args, callback);
        }
      };
    };
    var readFileThunk = Thunk(fs.readFile);
    readFileThunk(fileA)(callback);
    // 自动执行
    run(g)
    ```
#### 大名鼎鼎的co

- 说明
  - 不用手写上述的执行器，co模块其实就是将基于Thunk函数和Promise对象的两种自动Generator执行器包装成一个模块
  - 使用条件：yield后只能为Thunk函数或Promise对象或Promise对象数组

- 基于Promise的执行器
  ```js
  function run(fn) {
    let gen = fn()
    function cb(data) {
      // 将上一个任务返回的data作为参数传给next方法，控制权交回到Generator
      // 这里将result变量引用{value, done}对象
      // 不要和Generator中的`let result = yield xxx`搞混
      let result = gen.next(data)
      if (result.done) return result.value
      result.value.then(function(data){
        // resolved之后会执行cb(data)
        // 开启下一次循环，实现自动执行
        cb(data)
      })
    }
    cb()
  }
  ```
- 源码分析

  其实和上面的实现类似
  ```js
  function co(gen) {
    var ctx = this;
    var args = slice.call(arguments, 1) // 除第一个参数外的所有参数
    // 返回一个Promise对象
    return new Promise(function(resolve, reject) {
      // 如果是Generator函数，执行获取遍历器对象gen
      if (typeof gen === 'function') gen = gen.apply(ctx, args);
      if (!gen || typeof gen.next !== 'function') return resolve(gen);
      // 第一次执行遍历器对象gen的next方法获取第一个任务
      onFulfilled();
      // 每次异步任务执行完，resolved以后会调用，控制权又交还给Generator
      function onFulfilled(res) {
        var ret;
        try {
          ret = gen.next(res); // 获取{value,done}对象，控制权在这里暂时交给异步任务，执行yield后的异步任务
        } catch (e) {
          return reject(e);
        }
        next(ret); // 进入next方法
      }
      // 同理可得
      function onRejected(err) {
        var ret;
        try {
          ret = gen.throw(err);
        } catch (e) {
          return reject(e);
        }
        next(ret);
      }
      // 关键
      function next(ret) {
        // 遍历执行完异步任务后，置为resolved，并将最后value值返回
        if (ret.done) return resolve(ret.value);
        // 获取下一个异步任务，并转为Promise对象
        var value = toPromise.call(ctx, ret.value);
        // 异步任务结束后会调用onFulfilled方法（在这里为yield后的异步任务设置then的回调参数）
        if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
        return onRejected(new TypeError('You may only yield a function, promise, generator, array, or object, '
          + 'but the following object was passed: "' + String(ret.value) + '"'));
      }
    })
  }
  ```
  其实还是一样，为Promise对象then方法指定回调函数，在异步任务完成后触发回调函数，在回调函数中执行Generator的next方法，进入下一个异步任务，实现自动执行。

  举个🌰

  ```js
  'use strict';
  const fs = require('fs');
  const co =require('co');
  function read(filename) {
    return new Promise(function(resolve, reject) {
      fs.readFile(filename, 'utf8', function(err, res) {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      });
    });
  }
  co(function *() {
    return yield read('./a.js');
  }).then(function(res){
    console.log(res);
  });
  ```

## lesson4 async函数

### 语法糖

- 比较
  ```js
  function* asyncReadFile () {
    const f1 = yield readFile('/etc/fstab');
    const f2 = yield readFile('/etc/shells');
    console.log(f1.toString());
    console.log(f2.toString());
  };
  const asyncReadFile = async function () {
    const f1 = await readFile('/etc/fstab');
    const f2 = await readFile('/etc/shells');
    console.log(f1.toString());
    console.log(f2.toString());
  };
  ```
  看起来只是写法的替换，实际上有这样的区别
  - async函数内置执行器，不需要手动执行next方法，不需要引入co模块
  - async适用更广，co模块对yield后的内容严格限制为Thunk函数或Promise对象，而await后可以是Promise对象或原始类型值
  - 返回Promise，这点和co比较像

- 用法
  - async标识该函数内部有异步操作
  - 由于async函数返回的是Promise，所以可以将async函数作为await命令的参数
  - async函数可以使用在函数、方法适用的许多场景

### 语法

- 返回的Promise

  - async函数只有在所有await后的Promise执行完以后才会改变返回的Promise对象的状态（return或者抛错除外）即只有在内部操作完成以后才会执行then方法
  - async函数内部return的值会作为返回的Promise的then方法回调函数的参数
  - async函数内部抛出的错误会使得返回的Promise变成rejected状态，同时错误会被catch捕获

- async命令及其后的Promise

  - async命令后如果不是一个Promise对象，则会被转成一个resolved的Promise
  - async命令后的Promise如果抛错了变成rejected状态或者直接rejected了，都会使得async函数的执行中断，错误可以被then方法的回调函数catch到
  - 如果希望async的一个await Promise不影响到其他的await Promise，可以将这个await Promise放到一个try...catch代码块中，这样后面的依然会正常执行，也可以将多个await Promise放在一个try...catch代码块中，此外还可以加上错误重试

### 使用注意

- 相互独立的异步任务可以改造下让其并发执行（Promise.all）
  ```js
  let [foo, bar] = await Promise.all([getFoo(), getBar()]);
  ```

- await 与 for ... of

  应该还在提案阶段吧
  ```js
  for await (const item of list) {
    console.log(item)
  }
  ```

### 实现

- 其实就是将执行器和Generator函数封装在一起，详见上一课

### 举举🌰

- 并发请求，顺序输出
  ```js
  async function logInOrder(urls) {
    // 并发读取远程URL
    const textPromises = urls.map(async url => {
      const response = await fetch(url);
      return response.text();
    });
    // 按次序输出
    for (const textPromise of textPromises) {
      console.log(await textPromise);
    }
  }
  ```

目前了解到的异步解决方案大概就这样，Promise是主流，Generator作为容器，配合async await语法糖提供了看起来似乎更加优雅的写法，但实际上因为一切都是Promise，同步任务也会被包装成异步任务执行，个人感觉还是有不足之处的。