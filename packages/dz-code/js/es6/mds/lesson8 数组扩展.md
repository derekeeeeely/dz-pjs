## lesson8 数组扩展

### 扩展运算符

- `...` 可以理解为rest参数的逆运算，将数组转化为逗号分隔的参数序列，如``Math.max(...[14, 3, 77])``
- 复制数组（直接赋值是引用，指向相同地址）
    ```js
    // es5 
    a1 = [1,2];    a2 = a1.concat()
    // es6
    a1 = [1,2];    a2 = [...a1]
    ```
- 合并数组
- 与解构结合
    > 扩展运算符用于数组赋值时，只能作为最后一个参数
    ```js
    const [a, ...b] = [1,2,3,4]
    ```
- 字符串
    ```js
    // 生成数组
    [...'hello']
    // 返回字符串正确长度，兼容4字节UTF-16编码的Unicode字符
    function length(str) {
    return [...str].length;
    }
    ```

- 实现了 Iterator 接口的对象（下回分解）
- Map Set Generator（下回分解）

### Array方法

- `Array.from()`
    > 将`arraylike`对象和可遍历对象转为数组
    ```js
    // Array.prototype.slice
    Array.from 
    // Array.from(arrayLike).map(x => x * x)
    // 接收第二个参数，类似map，可用于如NodeList对象等处理，获取dom节点的属性
    Array.from(arrayLike, x => x * x) 
    Array.from([1, , 2, , 3], (n) => n || 0)
    // 第三个参数，可以绑定this
    ```
    > `...`调用的是遍历器接口（`Symbol.iterator`），若对象没有部署这个接口，就不能转化为数组，`Array.from`可以转换任何有length属性的对象

    > 因吹斯听
    ```js
    Array.from({ length: 2 }, () => 'jack')
    效果：第一个参数为第二个参数（函数）指定执行次数
    ```

- `Array.of`
    > 总是返回参数值组成的数组，如果没有参数，就返回一个空数组
    ```js
    // 弥补构造函数Array()的不足（1-2个参数时）
    function ArrayOf(){
        return [].slice.call(arguments);
    }
    ```

- `copyWithin` 用途不明
- `find` `findIndex` 前者返回第一个值/`undefined`，后者返回位置/-1
- `fill` 数组填充，可以指定起始、结束位置
- `keys()` `values()` `entries()` 用于遍历数组，返回遍历器对象，可以使用for...of循环也可以手动调用遍历器对象的next方法。分别对应 键、值、键值对（[0,'a']）
- `includes()` 判断数组中是否包含某个值，解决了indexOf对NaN的误判（因为NaN!==NaN，indexOf是===判断） 
- 空位，es6上述数组扩展对空位处理比较一致，值设为undefined，遍历时视为存在