/*
* @Author: Derek
* @Date:   2017-04-12 21:20:31
* @Last Modified by:   derekeeeeely
* @Last Modified time: 2017-04-26 18:50:45
*/

module.exports = {
    development:{
        mysql: {
            username: "root",
            password: "12345678",
            database: "derekzhou",
            host: "127.0.0.1",
            dialect: "mysql",
            logging : console.log,
            timezone : "+08.00",
            port: "3306",
            pool: {
                max: 5,
                min: 0,
                idle: 10000
            }
        },
        redis: {
            host: "127.0.0.1",
            port: 6379,
            db: 10
        },
        baseUrl: 'http://127.0.0.1:3000'
    },
    production:{
        mysql: {
            username: "root",
            password: "12345678",
            database: "derekzhou",
            host: "127.0.0.1",
            dialect: "mysql",
            logging : console.log,
            timezone : "+08.00",
            port: "3306",
            pool: {
                max: 5,
                min: 0,
                idle: 10000
            }
        },
        redis: {
            host: "127.0.0.1",
            port: 6379,
            db: 10
        },
        baseUrl: 'http://127.0.0.1'
    }
}
