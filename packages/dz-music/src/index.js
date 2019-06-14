import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'mobx-react'
import stores from './stores'
import App from './App'

if (module.hot) {
  module.hot.dispose(function () {
    // 模块即将被替换时
  });

  module.hot.accept(function () {
    // 模块或其依赖项之一刚刚更新时
  });
}

ReactDOM.render((
  <BrowserRouter>
    <Provider {...stores}>
      <App />
    </Provider>
  </BrowserRouter>
), document.getElementById('root'))
