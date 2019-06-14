import { Provider } from 'mobx-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import store from './store';


ReactDOM.render((
  <HashRouter>
    <Provider {...store}>
      <App />
    </Provider>
  </HashRouter>
), document.getElementById('root'))
registerServiceWorker()
