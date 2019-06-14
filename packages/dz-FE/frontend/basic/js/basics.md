## 内置类型

### 分类
- 基本类型 `number, string, boolean, null, undefined, symbol`
- 对象Object

### 判断类型
- `typeof`

    对于基本类型（null除外）都能得到正常结果

    对于对象（函数除外）都显示object
- `Object.prototype.toString.call`

    正确获取对象type的方法
    ```js
    Object.prototype.toString.call([]) // [object Array]
    ```
### 类型转换
- 显示转换

   ` Number(), Boolean(), String(), Object()`
- 隐式转换

    基本类型之间的转换比较简单，怪异的地方在于对象转基本类型

    对象转基本类型发生在一些运算符操作时
    - `!`操作符将对象转`boolean`

        这个是最简单的，全是true
    - 四则运算

        `+`：一方为字符串则另一方也转为字符串
        ```js
        [1, 2] + [2, 1] === '1,22,1'
        'a' + +'b' ===' aNaN'
        ```
        其他：一方为数字则另一方也转为数字
    - `==`

        最闹心的东西，其实不需要去硬记那些规则，大致如下：

        - 同类型比较不用多说，注意`NaN!==NaN, +0 == -0`
        - 一方为number或者boolean时，另一方转为基本类型以number比较
        - 一方为string时，另一方转为基本类型再参照上一条比较

    - 对象转基本类型(toPrimitive)

        `Symbol.prototype[@@toPrimitive]`, `Object.prototype.toString()`, `Object.prototype.valueOf()`

        以上是对象转基本类型时调用的方法，可以自己重写

## 原型和继承

### 原型链

![](http://opo02jcsr.bkt.clouddn.com/8-8-2018,-1:23:31-PM.png)

- 函数的`prototype`

    每个函数都有一个原型prototype(Function.prototype.bind()创建的函数除外，因为Function.prototype是內建的东西)，函数的prototype初始只有constructor一个属性，指向函数本身
- 对象的`__proto__`

    由构造函数生成的对象会有一个__proto__的属性，称为隐式原型，指向了构造函数的原型
    ```js
    a.__proto__ === A.prototype
    ```
    我们所说的原型链其实就是根据这样的联系构建起来的一个链路

- `new`关键字

    `new`关键字执行的时候实际上做了这么几步
    - 创建空对象
    - 绑定原型
    - 绑定this
    - 返回对象
    ```js
    function create(){
        const obj = new Object()
        // Con为构造函数本身
        const Con = [].shift.call(arguments)
        obj.__proto__ = Con.prototype
        // 绑定this
        const res = Con.apply(obj, arguments)
        return res
    }
    ```
- `instanceof`

    js的继承实际上不是说根据类的定义将类的属性copy到实例上，js的继承实际上是通过__proto__和prototype建立联系，使得方法/属性可以通过原型链访问到。因此要判断继承关系还是需要通过原型链

    ```js
    function instanceof(a, b) {
        const proto = b.prototype
        let _proto = a.__proto__
        while(true) {
            // 到头了
            if (_proto === null) {
                return false
            }
            if (proto === _proto) {
                return true
            }
            _proto = _proto.__proto__
        }
    }
    ```
### 继承

es6的class简化了继承的写法

```js
class A {
    constructor(value) {
        // 生成对象的实例属性
        this.value = value
    }
    // doA挂在A的prototype上
    doA(){
        console.log(123)
    }
}
class B extends A{
    // 达到重写的目的，但实际上A的原型上的方法还是在的
    doA(){
        console.log(456)
    }
}
```

## this，执行上下文与作用域

### before it

![](http://opo02jcsr.bkt.clouddn.com/6-21-2018,-3:09:06-PM.png)

介绍几个概念

- Handle

    内存分配在堆(heap)内进行，javaScript的值和对象都在堆内，Handle(句柄)是指向对象的一个指针，所有V8对象都是通过句柄访问，这样GC机制才能实现。

    Handle分为Local和Persistent两种，前者被HandleScope管理，是局部的，后者不受HandleScope管理，需要Persistent::New, Persistent::Dispose配对使用，类似C++的new和delete。

- Handle Scope

    HandleScope是Handle的容器，HandleScope生命周期结束时Handle会被释放，引起heap中对象引用的更新。

- Context

     Context是javaScript执行的环境，其中包含了javaScript的内建对象和内建函数等。Context可以嵌套，可以从A切换到B。


- 看点不一样的`hello world`

    ```c++
    #include <v8.h>
    using namespace v8;
    int main(int argc, char* argv[]) {
    // 创建一个Handle容器
    HandleScope handle_scope;
    // 创建一个执行环境/上下文
    Persistent<Context> context = Context::New();
    // 进入创建的执行环境
    Context::Scope context_scope(context);
    // 创建String
    Handle<String> source = String::New("'Hello' + ', World!'");
    // 编译源码
    Handle<Script> script = Script::Compile(source);
    // 执行得到结果
    Handle<Value> result = script->Run();
    // 执行环境销毁
    context.Dispose();
    // 打印结果
    String::AsciiValue ascii(result);
    printf("%s\n", *ascii);
    return 0;
    // handle_scope生命周期结束，handle都被释放
    }
    ```

### 执行上下文

js执行一段可执行代码时会产生执行上下文，执行上下文存在栈中

#### 举个🌰

```js
function B() {}
function A() {
    B()
}
```
like this:
```js
stack = []
stack.push(globalContext) // 全局Context
stack.push(Acontext) // 执行A函数
stack.push(Bcontext) // 调用B函数
stack.pop() // B执行完毕，出栈
stack.pop() // A执行完毕，出栈
```
#### 上下文中内容

![](http://opo02jcsr.bkt.clouddn.com/6-21-2018,-3:56:38-PM.png)
- 变量对象VO(variable object)

    变量对象存储了上下文中定义的变量和声明，也包含一些内建的对象。

    全局上下文中的变量对象就是全局对象，包含有很多内建的对象和方法

    函数上下文中的变量对象又称活动对象AO(active object)，初始时只有Arguments对象

    - 进入执行上下文: 进行函数、变量声明和形参声明

        ```js
        function foo(a) {
            f()
            function f() {
                console.log(123)
            }
            function f() {
                console.log(456)
            }
            var f = 1
        }
        foo(1) // 456
        ```

        函数优先于变量被提升声明，同名函数会被覆盖

        与已有函数/变量同名的变量声明会被忽略

        此时的变量对象/活动对象为
        ```js
        AO = {
            arguments: { 0: 1, length: 1},
            a: 1,
            f: reference to function f() {},
        }
        ```
    - 执行过程

        根据代码执行结果修改活动对象的值

- 作用域链[[scope]]

    我们说函数的作用域是在函数定义的时候确定的，那是因为函数都有一个内部属性[[scope]]，包含了父级变量对象
    ```js
    function foo() {
        function bar() {

        }
    }
    ```
    此时两个函数的[[scope]]：
    ```js
    foo.[[scope]] = [globalContext.VO]
    bar.[[scope]] = [globalContext.VO, fooContext.AO]
    ```
    函数执行时，进入对应上下文，会将该上下文中的AO加到[[scope]]的前面
    ```js
    bar()
    // AO为bar执行上下文中的活跃对象
    // Scope为bar执行上下文的作用域链
    Scope = [AO].concat(bar.[[scope]])
    ```

    而这个Scope就是我们查找变量值的作用域链

    举个🌰
    ```js
    var a = 'outside'
    function foo() {
        var a = 'inside'
        return a
    }
    foo()
    ```
    步骤如下
    ```js
    // 1.创建foo函数
    foo.[[scope]] = [globalContext.VO]
    // 2.执行foo函数
    stack = [globalContext, fooContext] // 上下文压栈
    // 3.复制函数[[scope]]创建作用域链
    fooContext.Scope = fooContext.[[scope]]
    // 4.函数/变量声明 -> 活动对象创建
    AO = { arguments: { length: 0 }, a: undefined }
    // 5.将AO加到作用域链顶端
    fooContext.Scope = [AO, fooContext.[[scope]]]
    // 6.函数执行修改AO值
    AO = { arguments: { length: 0 }, a: 'inside' }
    // 7.函数返回，fooContext出栈
    stack = [globalContext]
    ```

- this

    this的指向规则其实很简单，分为以下几种情况：
    - 全局/普通调用 -----> 顶层对象/undefined(严格模式)
    - 存在引用，即函数作为对象属性被直接调用 -----> 该对象
    - 构造函数生成 -----> 生成对象
    - `call, apply. bind` 强制改变this指向

    然而...this赋值的原理，并不是很懂啊...很难受

#### 小结

函数创建时生成词法作用域[[scope]]，执行时创建执行上下文并压栈，执行上下文创建时需要复制函数的作用域创建作用域链。

然后进行函数/变量的声明和形参声明(根据arguments对象生成)，根据上述对象生成活动对象，并将活动对象加到作用域链顶端，变量查找依赖该作用域链。

函数执行时会修改AO的值，会根据调用方式为this赋值，函数执行完毕后，上下文出栈(暂不考虑闭包)

## 闭包Closure

### 概念

记得7788的一句话：

> A closure is a function plus the connection to the variables of its surrounding scopes.

闭包是由函数和函数创建时的词法环境组成的，可以访问到创建时能访问到的所有局部变量。

```js
function a () {
    const c = 1
    return function b () {
        console.log(c)
    }
}
const d = a()
d()
```

这里存在一个闭包，函数b在创建环境之外调用时依然能够访问到创建时环境的局部变量。

回到上一小节，闭包的情况下，因为内部函数存在对外部函数的变量引用，外部函数的执行上下文并不会出栈，导致内存占用会增加，所以闭包其实并不是那么美好。

### 注意

js内可以说是无处不闭包，很多时候我们只是没有意识到这样一个概念，其实很多地方已经都在用了

```js
// 最简单的情况，返回一个函数
function a () {
    return function b () {}
}
```

题目来一个
```js
var m = 1;
var obj = {
    m: 2,
    fn: function() {
        return function() {
            console.log(this.m)
        }
    }
}
obj.fn()() // 1
```
```js
var m = 1;
var obj = {
    m: 2,
    fn: function() {
        const that = this
        return function() {
            console.log(that.m)
        }
    }
}
obj.fn()() // 2
```
