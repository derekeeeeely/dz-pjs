# s

## lesson8 对象扩展

### 写法

- 属性、方法简写
    ```js
    { a } { a() {} }
    ```
- 属性名表达式、方法名表达式
    ```js
    { ['a' + 'bc']: 'a' }
    { ['a' + 'bc']() {} }
    // 注意属性名为对象时，会自动转为字符串`[object Object]`
    ```
- 方法名name
    ```js
    // 这种情况下`obj.foo.name`会报错
    const obj = {
        get foo() {},
        set foo(x) {}
    };
    // 正确写法
    const descriptor = Object.getOwnPropertyDescriptor(obj, 'foo');
    descriptor.get.name // get foo
    // special
    (new Function()).name // "anonymous"
    doSomething.bind().name // "bound doSomething"
    ```
### 方法

#### `Object.is`

- 比较
    ```js
    // 除了下列情况外和===的表现一致
    +0 === -0 //true
    NaN === NaN // false
    Object.is(+0, -0) // false
    Object.is(NaN, NaN) // true
    ```
#### `Object.assign`

- 用于对象合并，将源对象的所有可枚举属性复制到目标对象
    ```js
    Object.assign(target, source1, source2);
    ```

- 注意
    非对象出现在第一个参数会被转为对象，出现在后面只有字符串会以字符数组形式参与合并。（因为只有字符串的包装对象，会产生可枚举属性）
    对于undefined和null无法转为对象，多以出现在第一个参数位会报错，出现在后面会被忽略。
    浅拷贝，即如果源对象的某个属性是对象，则目标对象拷贝的是该对象的引用

- 用途
    - 为对象添加属性、方法
    - 克隆对象
    ```js
    // 只克隆原有可枚举属性
    function clone(origin) {
        return Object.assign({}, origin);
    }
    // 保持继承链
    function clone(origin) {
        let originProto = Object.getPrototypeOf(origin);
        return Object.assign(Object.create(originProto), origin);
    }
    ```
    - 合并多个对象
    - 为属性设置默认值（利用覆盖，注意应为简单类型）

#### `Object.getOwnPropertyDescriptors`

- 返回指向对象的所有自身属性的描述对象
- 由于Object.assign是赋值拷贝，所以无法正确拷贝对象的get和set方法，所以需要有方式去获取描述对象，再结合defineProperties进行
- 结合Object.create使用，浅拷贝

#### `Object.getPropertyOf`, `Object.setPropertyOf`, `__proto__`

- `__proto__`
    ```js
    obj = Object.create(someOtherObj);
    obj.__proto__ = someOtherObj;
    ```

- `Object.setPrototypeOf(obj, proto)`
    将proto对象设为obj的原型，第一个参数为undefined和null时报错，非对象时自动转

- `Object.getPrototypeOf(obj)`

#### `super`

- 指向当前对象的原型对象，只有对象的方法的简写模式中有效，否则报错
- `super.foo`等同于`Object.getPrototypeOf(this).foo`

#### `Object.keys`, `Object.values`, `Object.entries`

- `Object.entries` 用途：``new Map(Object.entries(obj))``

### 属性的可枚举和遍历

#### 可枚举

- 获取属性的描述对象
    ```js
    let obj = { foo: 123 };
    Object.getOwnPropertyDescriptor(obj, 'foo')
    //  {
    //    value: 123,
    //    writable: true,
    //    enumerable: true,
    //    configurable: true
    //  }
    ```
- 忽略 enumerable为false的操作
    ```js
    for ... in // 会返回继承的属性
    Object.keys()
    JSON.stringify()
    Object.assign()
    ```

- 遍历
    ```js
    for ... in // 遍历自身和继承的**可枚举**属性，不包含Symbol属性
    Object.keys // 返回一个数组，只包含自身所有**可枚举**属性，不包含Symbol属性
    Object.getOwnPropertyNames(obj) // 返回一个数组，包含对象自身的**所有**属性，不包含Symbol属性
    Object.getOwnPropertySymbols(obj) // 返回一个数组，包含对象本身的所有Symbol属性
    Reflect.ownKeys(obj) // 返回一个数组，包含自身**所有键名**
    // 共性：遍历顺序为 数值键-字符串键-Symbol属性
    ```

### 扩展运算符（略）

### Null传导运算符（提案）

- ``obj?.prop, obj?.[expr], func?.(...args), new C?.(...args)``
