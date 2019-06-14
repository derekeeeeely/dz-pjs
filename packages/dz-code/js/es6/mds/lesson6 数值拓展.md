# lesson6 数值扩展

- 0o/0O 八进制 0b/0B 二进制

- `Number.isFinite` `Number.isNaN`
    与全局`isFinite`、`isNaN`的差别在于前者只对数值有效，非数值一律返回`false`后者是先将非数值转化为数值再判断。
- `Number.ParseInt` `Number.ParseFloat` `Number.isInteger`
    逐步减少全局性方法，使得语言逐步模块化
- `Number.EPSILON` 可以接受的最小误差范围
- `isSafeInteger`
    ```js
    Number.isSafeInteger(9007199254740993)
    // false
    Number.isSafeInteger(990)
    // true
    Number.isSafeInteger(9007199254740993 - 990)
    // true
    9007199254740993 - 990
    // 返回结果 9007199254740002
    // 正确答案应该是 9007199254740003
    ```
    9007199254740993不是一个安全整数，但是Number.isSafeInteger会返回结果，显示计算结果是安全的。这是因为，这个数超出了精度范围，导致在计算机内部，以9007199254740992的形式储存

- Math对象扩展
    
    - 指数运算符`**`
    - `提案` Integer
