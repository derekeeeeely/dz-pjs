# lesson 4 字符串

- unicode表示

    js中，可以用\uxxxx表示字符，xxxx为该字符的Unicode码位。js内部，字符以UTF-16格式存储，即每个字符为2个字节(0x0000-0xFFFF)，对于需要4字节存储的例如汉字，在处理时可能会出现误判。

- `codePointAt`

```js
// 判断是否为4字节组成
function is32Bit(c) {
  return c.codePointAt(0) > 0xFFFF;
}
```

- `String.fromCodePoint`
    返回码点对应字符，支持4字节，即32位UTF-16字符

- 字符串遍历
    ``for ... of ...``遍历字符串，可以做到支持32位UTF-16字符

- 提案 `at`
    charAt返回的是UTF-16字符的前两个字节，提案at可以支持4字节UTF-16字符，需要垫片库支持

- ``include(), startsWith(), endsWith()``
    字面理解，注意可以传一个下标参数，表示查找位置

- ``repeat(), padStart(5, s = ''), padEnd(5, e = '')``
    padStart填充在前，padEnd填充在后，若原字符串长度大于第一个参数，则不填充返回原字符串，若加起来大于第一个参数则保留原，去除需添加的多余的。
    ```js
    '123456'.padStart(10, '0') // "0000123456"
    '12'.padStart(10, 'YYYY-MM-DD') // "YYYY-MM-12"
    ```

- 模板字符串

- 标签模板
    ```js
    let total = 30;
    let msg = passthru`The total is ${total} (${total*1.05} with tax)`;
    // ['The total is ', ' ', ' (', ' with tax)'], 30, 31.5
    function passthru(literals, ...values) {
    let output = "";
    let index;
    for (index = 0; index < values.length; index++) {
        output += literals[index] + values[index];
    }
    output += literals[index]
    return output;
    }
    msg // "The total is 30 (31.5 with tax)"
    ```

    > 过滤字符串

    ```js
    let message =
  SaferHTML`<p>${sender} has sent you a message.</p>`;

    function SaferHTML(templateData) {
    let s = templateData[0];
    for (let i = 1; i < arguments.length; i++) {
        let arg = String(arguments[i]);

        // Escape special characters in the substitution.
        s += arg.replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");

        // Don't escape special characters in the template.
        s += templateData[i];
    }
    return s;
    }
    ```

    > 其他用途有：i18n、模板处理、引入其他语言等

    ```js
    // 下面的hashTemplate函数
    // 是一个自定义的模板处理函数
    let libraryHtml = hashTemplate`
    <ul>
        #for book in ${myBooks}
        <li><i>#{book.title}</i> by #{book.author}</li>
        #end
    </ul>
    `;
    ```