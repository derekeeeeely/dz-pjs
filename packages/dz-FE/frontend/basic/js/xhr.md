<!-- ### XMLHttpRequest

#### 介绍

- 浏览器提供的web api，为客户端提供了在客户端和服务器之间传输数据的功能
- W3C对其进行了标准化，分为level1和level2，后者是对前者的改进

#### 使用

```js
const xhr = new XMLHttpRequest();
// open(method, url [, async = true [, username = null [, password = null]]])
xhr.open('post', '/test', true)
xhr.setRequestHeader('X-Test', 'one');
xhr.setRequestHeader('X-Test', 'two');
xhr.responseType = 'blob';
xhr.onload = function(e) {
  if (this.status == 200) {
    var blob = this.response;
    ...
  }
};
xhr.onreadystatechange = function () {
    switch(xhr.readyState){
      case 1://OPENED
        //do something
            break;
      case 2://HEADERS_RECEIVED
        //do something
        break;
      case 3://LOADING
        //do something
        break;
      case 4://DONE
        //do something
        break;
    }


``` -->