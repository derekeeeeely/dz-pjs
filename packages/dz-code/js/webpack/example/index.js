import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import App from './app'

// require.ensure(['./condition'], function (require) {
//   const content = require('./condition');
// });

const load = require('bundle-loader!./condition.js');
load((file) => {
  console.log(file)
})

const rootElement = document.getElementById("root")

ReactDOM.render(
  (<div>
    <App />
  </div>),
  rootElement
)
