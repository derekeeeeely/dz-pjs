## lesson1

### introduce

- 新的语法成为标准的过程

```bash
Stage 0 - Strawman（展示阶段）
Stage 1 - Proposal（征求意见阶段）
Stage 2 - Draft（草案阶段）
Stage 3 - Candidate（候选人阶段）
Stage 4 - Finished（定案阶段）
```

- .babelrc
```bash
npm install --save-dev babel-preset-latest

{
    presets: [
        "latest",
        "react",
        "stage-2"
    ],
    plugins: []
}
# presets的值集有latest，react，stage-0 to stage-3（对应不同阶段的提案，选择一个）
```

- babel-cli

```bash
# -s生成sourcemap，-o指定文件，-d指定目录
babel example.js -o compiled.js -s
# babel-node提供支持ES6的REPL环境，目标文件不需要考虑转码
babel-node es6.js
```

- babel-register

```bash
提供一个钩子，在require加载`.js`, `.jsx`, `.es`, `.es6`后缀的文件时先用babel实时转码，需在require别的文件前先require该模块
require("babel-register");
require("./index.js");
```

- babel-core

```bash
需要调用babel的api时，需要require该模块
var babel = require('babel-core');
// 字符串转码
babel.transform('code();', options);
```

- babel-polyfill

```bash
默认情况下babel只转句法，不转一些es6新的对象以及方法，这种情况下需要在脚本头部引入该模块转换使其可用
import 'babel-polyfill';
```

- Traceur

```bash
google提供的babel替代品
```