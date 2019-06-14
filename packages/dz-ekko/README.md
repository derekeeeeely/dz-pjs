# Ekko

Ekko是一个基于React的SPA(单页面应用)模板，搭配Ekko-cli使用能够实现快速搭建中后台系统前端页面。

Ekko中大量使用了Ant Design的组件，将UI实现、请求和前端状态管理等进行封装，暴露出对应的config文件进行对模块的配置，争取减轻非专业前端开发者的负担。

## 环境要求

- `node`, `npm`

## 用法

### Ekko-cli

提供简单易用的命令行命令拉取模板建立本地项目、生成项目模块等

working on it

### 本地启动

- 依赖安装
  ```
  yarn install
  ```
- 本地启动
  ```
  yarn start
  ```
- 浏览器打开 ``http://127.0.0.1:3000``，你将看到一个demo页面

  ![](http://opo02jcsr.bkt.clouddn.com/8-17-2018,-2:05:35-PM.png)

### 配置式开发

#### 菜单配置


```js
// 代码位于src/container/config.js
[{
  name: '基本类型',
  key: 'basic',
  icon: 'team',
  children: [{
    name: '查询类',
    url: '/searchPage',
  }, {
    name: '表单类',
    url: '/formPage',
  }]
}]
```

菜单可以进行多级嵌套，Ekko-cli将提供自动生成菜单项的命令，当然你也可以手动在这里调整菜单关系。

#### 页面类型

Ekko-cli将提供命令根据页面类型自动生成页面文件，当前提供了两种类型的模板：`搜索类`和`表单类`。

- 搜索类

  ![](http://opo02jcsr.bkt.clouddn.com/8-17-2018,-2:06:06-PM.png)


  搜索类分为搜索区域和列表区域两部分

  搜索区域配置如下：

  ```js
  // 代码位于src/pages/searchPage/config.js
  search: {
    fields: [
      { title: '性别', dataKey: 'sex', type: 'select', defaultValue: 'any', options: optionsA, required: true },
      { title: '年龄', dataKey: 'age', type: 'number' },
      { title: '单身', dataKey: 'single', type: 'select', options: optionsB },
      { title: '时间', dataKey: 'ccc', type: 'time' }
    ],
    url: 'https://pandora.derekz.cn/ekko'
  },
  ```

  - `fields` 是搜索项配置，`title, dataKey, type`为必填项，其中`type`目前支持普通选择框、输入框、数字输入框、时间选择框四种，`required`项为点击搜索时是否校验该项必填，具体可以查看demo配置代码。
  - `url` 是点击搜索时请求的api接口地址。

  列表区域配置如下：

  ```js
  // 代码位于src/pages/searchPage/config.js
  table: {
    fields: [
      { title: '姓名', dataKey: 'name' },
      { title: '年龄', dataKey: 'age' },
      { title: '性别', dataKey: 'sex' },
      { title: '单身', dataKey: 'single' }
    ],
    actions: [
      { title: '删除', type: 'button', url: 'https://pandora.derekz.cn/ekko/delete' },
      { title: '启停', type: 'switch', related: 'single', url: 'https://pandora.derekz.cn/ekko/close' }
    ]
  }
  ```

  - `fields` 是表格内容配置，`title, dataKey`为必填项。
  - `actions` 是表格编辑栏内容配置，`title, type, url`为必填项，`type`目前提供`button`, `switch`两种，`switch`表示启停，需要提供`related`字段对应表示启停状态的字段，`url`为执行操作的具体接口请求地址。

- 表单类

  ![](http://opo02jcsr.bkt.clouddn.com/8-17-2018,-2:10:32-PM.png)

  表单类配置如下：

  ```js
  // 代码位于src/pages/formPage/config.js
  url: 'https://pandora.derekz.cn/ekko/add',
  items: [
    { dataKey: 'name', title: '姓名', type: 'input' },
    { dataKey: 'age', title: '年龄', type: 'number',
      rules: [{
        required: true,
        message: '年龄必填'
      }, {
        // 校验表单，可以考虑封装到组件内
        validator: (rule, value, callback) => {
          if (!/^\d+(.\d{0})?$/.test(value)) {
            callback('请输入正整数')
          }
          callback()
        }
      }]
    },
    { dataKey: 'sex', title: '性别', type: 'select',
      options: [{ value: 'male', mean: "male" }, { value: 'female', mean: "female"}]
    },
    { dataKey: 'single', title: '单身', type: 'select',
      options: [{ value: 0, mean: "no" }, { value: 1, mean: "yes" }]
    },
  ]
  ```

  - url为表单提交时的api接口地址。
  - items为表单项配置，其中每项的`dataKey, title, type`为必填项，目前`type`支持普通输入框、数字输入框、选择框三种。
  - rules字段用于对单项进行校验，可以参考[ant design](https://ant.design/components/form-cn/)

### 发布

#### 简单说明

- 将前端代码打包，打包时根据项目版本号生成对应后缀的js文件
- 文件上传至oss，承载页面模板引用对应版本js文件
- 修改代码后需要发布到各环境时，选择是否更改版本号进行打包
- 版本号未变更则上传覆盖之前文件，刷新页面

#### 简单命令

  ```shell
  npm run publish
  ```
  未更改版本号的情况，需要再次确认后上传覆盖
  ```shell
  node scripts/upload.js -f
  ```