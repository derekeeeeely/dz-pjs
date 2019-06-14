/*
 * @Author: derekeeeeely
 * @Date:   2017-04-19 15:20:43
 * @Last Modified by:   derekeeeeely
 * @Last Modified time: 2017-04-19 15:33:38
 */

'use strict'
let fs = require("fs")
let path = require("path")
let Sequelize = require("sequelize")
let env = process.env.NODE_ENV || "development"
let config = require('../conf/config')[env]
let sequelize = new Sequelize(config.mysql.database, config.mysql.username, config.mysql.password, config.mysql)
let db = {}

sequelize
    .authenticate()
    .then(function(err) {
        console.log('mysql database connection has been established successfully.')
    }, function(err) {
        console.log('Unable to connect to the mysql database:', err)
    })

fs.readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js")
    })
    .forEach(function(file) {
        let model = sequelize.import(path.join(__dirname, file))
        model && (db[model.name] = model)
    })

Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db)
    }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
