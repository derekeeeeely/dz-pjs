import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'mobx-react'
import store from './store'
import App from './App'
import registerServiceWorker from './registerServiceWorker';

// if (module.hot) {
//   module.hot.dispose(function () {
//     // 模块即将被替换时
//   });

//   module.hot.accept(function () {
//     // 模块或其依赖项之一刚刚更新时
//   });
// }

ReactDOM.render((
  <HashRouter>
    <Provider {...store}>
      <App />
    </Provider>
  </HashRouter>
), document.getElementById('root'))
registerServiceWorker();
