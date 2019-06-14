# lesson7 函数扩展

## 参数设置默认值、rest参数

- basic
- with解构
    ```js
    function m1({x = 0, y = 0} = {}) {
        return [x, y];
    }
    function m2({x, y} = { x: 0, y: 0 }) {
        return [x, y];
    }
    ```
    理解二者区别即可，其余可参见[解构](http://www.derekz.cn/posts/78048d04/)

- 函数的`length`属性：未指定默认值的参数个数

- 参数一旦设置了默认值，函数在声明初始化时会形成单独的作用域，初始化结束后释放掉。

    ```js
    let x = 1
    function m(y=x){
        let x = 2
        console.log(y)
    }
    m()// 1
    // 如果全局x不存在会报错，第二行相当于发生了let y = x, x指向全局的x, 不受内部x影响

    var x = 1;
    function foo(x, y = function() { x = 2; }) {
    var x = 3;
    y();
    console.log(x);
    }
    // 理解：这里有三个作用域，三个x，各不相干 3
    // 去掉var以后参数中的两个x和函数体内x是一样的，外部还是不变 2
    ```
- 应用
    指定参数必传，否则报错，即给参数赋值一个默认的函数抛错的结果，没传时得到的是这个抛出的错
    用默认赋值undefined表示该参数可省略
- 函数的length不包含rest参数
- rest参数之后不能再有参数
- 只要参数使用了默认值、解构赋值、或者扩展运算符，就不能显式指定严格模式

## 箭头函数

```js
const headAndTail = (head, ...tail) => [head, tail];
headAndTail(1, 2, 3, 4, 5) // [1,[2,3,4,5]]
```

- 注意
    - 箭头函数体内的this指向函数定义时的对象，不是对应运行时的对象
    - 不可以当做构造函数
    - 不可以使用yield
    - 不可以使用arguments
    - 不可以使用bind、call、apply来改变箭头函数this指向
- this指向的固定化，并不是因为箭头函数内部有绑定this的机制，实际原因是箭头函数根本没有自己的this，导致内部的this就是外层代码块的this

## 其他

- 双冒号运算符

```js
obj::func === func.bind(obj)
foo::bar(...arguments) === bar.apply(foo, arguments)
```

- 尾调用优化
    
```js
// 函数f的最后一步为函数g调用
function f(x){
  return g(x);
}
```

函数调用会在内存在生成调用记录，即调用帧，如A函数中调用B函数，则会在A的调用帧上方形成B的调用帧，B调用完后，返回至A才会消失。尾调用实际上已经不用保存外层A的调用帧了，可以优化。

**只有不再用到外层函数的内部变量，内层函数的调用帧才会取代外层函数的调用帧，否则就无法进行“尾调用优化”**

- 尾递归优化

```js
// 非尾递归
function Fibonacci (n) {
  if ( n <= 1 ) {return 1};
  return Fibonacci(n - 1) + Fibonacci(n - 2);
}
// 尾递归
function Fibonacci2 (n , ac1 = 1 , ac2 = 1) {
  if( n <= 1 ) {return ac2};
  return Fibonacci2 (n - 1, ac2, ac1 + ac2);
}

传统递归需要保存相当多的调用帧，尾递归只保存一个，节省内存，避免发生栈溢出
```

- 柯里化

    将多参数函数变成单参数形式（具体下次再论）

- es2017支持函数最后一个参数尾逗号
- 在不需要错误实例的时候，提案try...catch...菜单catch块不需要参数
