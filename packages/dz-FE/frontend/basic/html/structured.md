# 结构化与SEO

## SEO
### 描述
SEO(search engine optimization, 搜索引擎优化)，利用搜索引擎的搜索规则来提高目标网站在搜索引擎索引库内的得分和排名。
### 常用
- title
- description
  ```html
  <meta name="description" content="xxxx" />
  ```
- keywords
  ```html
  <meta name="keywords" content="xxxx" />
  ```
## html结构化
### doctype

浏览器根据doctype选择使用什么规范来进行文档解析
### 语义化标签
`header`, `nav`, `section`, `aside`, `article`, `footer`等，详见 [here](structured.html)
### 好处
- 语义化标签具有更丰富的含义，方便开发、维护
- 利于搜索引擎识别页面的各部分
- 方便其他设备

## WAI-ARIA
### 描述
ARIA(Accessible Rich Internet Applications, 可访问富互联网应用)，是一个为残疾人士等提供无障碍访问动态、可交互web内容的技术规范
### 简单了解
- `role` 部分html5标签自带role，主要是设定元素的角色
- `aria-` aria属性有不少，主要是控制元素的一些行为表现


> 这一part其实不是很感兴趣，点到为止，详细内容参考大漠老师的 [WAI-ARIA 无障碍Web规范
](https://www.w3cplus.com/wai-aria/wai-aria.html)

## web components
### 标准化的组件封装
每个组件组织自己的html/css/js，不影响页面其他部分
### shadow dom
通过shadow dom创建子dom树，和主文档流互不干扰
### 使用
组件内定义好html结构和样式，也即模板，通过js脚本将模板转为dom elment并插入到shadow root，再在document上注册一个自定义的key，组件被link引用后，可以直接使用这个key作为自定义标签使用
具体代码见 [here](web_components.html)
### 好处
- 无侵入、标准化组件
- 语义化，结构化