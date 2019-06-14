  <!-- # 浏览器工作原理

## 简介

浏览器大概是使用最为广泛的软件了。这本书中我将为大家解释其背后的工作原理。跟随我，我们将看到从你在浏览器的地址栏输入“google.com”到你在浏览器看到谷歌的页面，这之间发生了什么。

### 我们将要谈及的浏览器
 -->

- user interface
- brower engine(api)
- rendering engine
- network | js engine(v8) | ui backend(paint)
- databse

- rendering engine
  - parse
    - lexer (html -> tokens)
    - paser (tokens -> parse tree)

    lexer将原始content打碎成tokens，paser一个个索要token，匹配到语法规则则在parse tree上加入节点，再索要下一个token，匹配不到规则则暂存token，继续索要更多token直到所有暂存token都匹配到一条规则。如此直到所有token完毕，否则报错。

  - html语法不是上下文无关的，所以浏览器自己实现了解析语法

    document -> tokenization -> tree construction -> dom

    - tokenization

      state machine

      html content一个个输入，根据状态流转emit出token

      ![state](http://derekzhou.oss-cn-hongkong.aliyuncs.com/image019.png)

    - tree construction

      上一步吐出的token一个个经历新的状态流转，一点点加入到dom对象里

      ![state](http://derekzhou.oss-cn-hongkong.aliyuncs.com/image022.gif)

      Each node emitted by the tokenizer will be processed by the tree constructor

  - css parser

    css属于上下文无关文法，可以使用正则表达式表示token，使用BNF泛型描述语法

    webkit使用flex和bison自动生成词法分析器和语法分析器，经过这两步后最终会为每个css文件生成一个stylesheet object，每个object包含很多css rule

    ![style](http://derekzhou.oss-cn-hongkong.aliyuncs.com/image023.png)

  - render tree

    While the DOM tree is being constructed, the browser constructs another tree, the render tree

    It is the visual representation of the document

    render tree每个节点是一个render object，记录具体的位置，样式，图层，并有layout和paint方法

    render object会根据dom node类型和display属性创建不同类型的object（inline、block等），代表一个长方形区域。

    ```c++
    class RenderObject{
      virtual void layout();
      virtual void paint(PaintInfo);
      virtual void rect repaintRect();
      Node* node;  //the DOM node
      RenderStyle* style;  // the computed style
      RenderLayer* containgLayer; //the containing z-index layer
    }
    ```

    render tree相当于dom tree，但是有所不同，一个dom elment可能对应多个render tree节点（视觉对象），也有可能找不到对应，如display none的dom节点和head里的东西，再render tree上都不会有对应节点。对应位置也有可能不同，如脱离了文档流的float和absolute等

    解析html和body -> start render tree root -> root为viewport -> 伴随dom解析构造render tree

  - layout

    从root renderer出发（对应html文档元素）
    所有的renderers都有layout和reflow方法计算position和size

    - 增量layout

      dirty renderers以及children dirty renderers会异步增量layout，webkit有timer来执行增量layout

    - global layout

      一般是同步进行，全局样式变更时会触发
  - demo
    语法为上下文无关的语言能被常规parser解析，能够用BNF泛型完全表示的语法为上下文无关语法
    - 表示
      INTEGER :0|[1-9][0-9]*
      PLUS : +
      MINUS: -
    - BNF 范式
      expression :=  term  operation  term
      operation :=  PLUS | MINUS
      term := INTEGER | expression
    - bottom up | top down
      - bottom up
      3 + 2 - 1
      stack     input
      term      +2-1
      term exp  2-1
      exp       -1
      exp oper  1
      exp
    - html的语法不是上下文无关的，它使用DTD定义标准，DOM是html document的对象表示，也是HTML elements对外的接口

  - question

    浏览器解析html、css、js以及关键事件的顺序

  - 缓存
    - 强制缓存
      - expired 绝对时间
      - cache-control max-age 相对时间
    - 协商缓存
      - last-modified/if-modified-since
      - etag/if-none-match
    - from memory cache | from disk（强制缓存200）
      - css存入disk，其他解析后存入memory
      - 刷新页面cache一部分来自于进程内存，一部分来自于disk

    强制缓存优于协商缓存，协商缓存有服务端决定是否使用缓存(304)