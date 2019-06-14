/*
* @Author: derekeeeeely
* @Date:   2017-04-19 21:26:08
* @Last Modified by:   derekeeeeely
* @Last Modified time: 2017-04-19 21:34:27
*/

'use strict'
let env = process.env.NODE_ENV || "development"
let config = require('../conf/config')[env],
    Redis = require('ioredis'),
    client = new Redis({
        port: config.redis.port,
        host: config.redis.host,
        db: config.redis.db
    })

module.exports = client;
