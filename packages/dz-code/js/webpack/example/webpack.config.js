const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// 公共的文件拆分为vendor.js
const commonPlugin = new webpack.optimize.CommonsChunkPlugin({
  name: 'vendor',
  filename: 'vendor.js'
})

// 通过命令里传入的参数区分环境，自定义plugin，在项目中可以直接使用
const devFlagPlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
})

module.exports = {
  entry: {
    app: './index.js',
    vendor: ['jquery']
  },
  output: {
    filename: 'bundle.js'
  },
  plugins: [
    new UglifyJsPlugin(),
    devFlagPlugin,
    commonPlugin
  ],
  externals:{
    'derek': 'derek'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'react']
          }
        }
      },
      {
        test: /\.(css|less)$/,
        use: [{
          loader: 'style-loader'
        },{
          loader: 'css-loader'
        }, {
          loader: 'less-loader',
          options: {
            modules: true
          }
        }]
      },
      {
        test: /\.(png|jpg|jpeg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 1024
          }
        }]
      }
    ]
  }
};
