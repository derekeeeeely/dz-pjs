/*
* @Author: Derek
* @Date:   2017-04-12 21:05:30
* @Last Modified by:   derekeeeeely
* @Last Modified time: 2017-04-24 22:45:05
*/

'use strict'
const Nuxt = require('nuxt')
const app = require('express')()
const bodyParser = require('body-parser')
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

app.set('port', port)
app.enable('trust proxy')
app.use(bodyParser.json())
app.use('/api', require('./service/api'))

// Import and Set Nuxt.js options
let config = require('./nuxt.config.js')
config.dev = (process.env.NODE_ENV === 'development')

// Init Nuxt.js
const nuxt = new Nuxt(config)
app.use(nuxt.render)

// Build only in dev mode
if (config.dev) {
    nuxt.build()
        .catch((error) => {
            // eslint-disable-line no-console
            console.error(error)
            process.exit(1)
        })
}

// Listen the server
app.listen(port, host)
// eslint-disable-line no-console
console.log(`Server listening on ${host} : ${port}, at ${new Date().toLocaleString()}`)

module.exports = app

