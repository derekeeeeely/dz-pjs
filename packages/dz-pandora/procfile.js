'use strict'

module.exports = (pandora) => {

  // pandora
  //   .cluster('./src/server/app.js')

  pandora
    .process('worker')
    .scale(pandora.dev ? 1 : 'auto')
  pandora
    .process('spider')
    .scale(1)

  pandora
    .service('main', class Main{
      start() {
        require('./src/server/app.js')
      }
    })
    .process('worker')

  pandora
    .service('Puppeteer', './services/puppeteer.js')
    .process('spider')
    .publish()

};