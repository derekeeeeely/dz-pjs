/*
 * @Author: Derek
 * @Date:   2017-04-12 21:07:54
 * @Last Modified by:   derekeeeeely
 * @Last Modified time: 2017-04-28 10:44:25
 */

'use strict'
const app = require('../server')
const router = require('express').Router()
const axios = require('axios')
const qs = require('qs')
const env = process.env.NODE_ENV || "development"
const models = require('../models')
const redis = require('../redis/redis')

// models.article.sync().then(function() {
//     console.log('article has been created!')
// })


// models.user.sync().then(function() {
//     console.log('user has been created!')
// })

// models.comment.sync().then(function() {
//     console.log('comment has been created!')
// })

router.get('/auther', function(req, res) {
    models.sequelize.query('select * from user').then(function(data) {
        console.log(data)
    })
    res.json({
        code: 1,
        msg: 'ok'
    })
})

router.post('/upload', function(req, res) {
    let params = req.body.params;
    models.article.create({
        title: params.title,
        cover: params.cover,
        type: params.type,
        abstract: params.abstract,
        tags: params.tags,
        content: params.content,
    })
    .then(function(result) {
        redis.del('allArticles', function (error, result1){
            if(error){
                console.log(error)
            }
            console.log(result1)
        })
        res.json({
            code: 1,
            msg: 'ok',
            data: result
        })
    })
    .catch(function(err){
        console.log(err)
    })
})

router.post('/starOpt', function(req, res) {
    let params = req.body.params;
    models.article.update(
        {stars: params.stars},
        {where:
            {id: params.id}
        })
    .then(function(result) {
        redis.del('allArticles', function (error, result1){
            if(error){
                console.log(error)
            }
            console.log(result1)
        })
        res.json({
            code: 1,
            msg: 'ok',
            data: result
        })
    })
    .catch(function(err){
        console.log(err)
    })
})

router.get('/articles', function(req, res) {
    redis.get('allArticles', function (err, result){
        if(err){
            res.json({
                code: 0,
                msg: '获取失败',
                err: err
            })
        }
        else{
            if(!result){
                models.article.findAll({order: 'created_at desc'})
                .then(function(data) {
                    redis.set('allArticles', JSON.stringify(data), function(err2, reply){
                        if (err2) {
                            console.log(err2);
                        } else {
                            console.log(reply);
                        }
                    })
                    console.log('from db')
                    res.json({
                        code: 1,
                        msg: 'ok',
                        data: data
                    })
                })
            }
            else{
                console.log('from redis')
                res.json({
                    code: 1,
                    msg: '获取成功',
                    data: JSON.parse(result)
                })
            }
        }
    })
})

router.post('/id', function(req, res) {
    let articleId = req.body.param
    redis.get('article_' + articleId, function (err, result){
        if(err){
            res.json({
                code: 0,
                msg: '获取失败',
                err: err
            })
        }
        else{
            if(!result){
                models.article.findOne({
                    where: {
                        id: articleId
                    }
                })
                .then(function(data) {
                    redis.set('article_' + articleId, JSON.stringify(data), function(err2, reply){
                        if (err2) {
                            console.log(err2);
                        } else {
                            console.log(reply);
                        }
                    })
                    console.log('from db')
                    res.json({
                        code: 1,
                        msg: 'ok',
                        data: data
                    })
                })
            }
            else{
                console.log('from redis')
                res.json({
                    code: 1,
                    msg: '获取成功',
                    data: JSON.parse(result)
                })
            }
        }
    })
})

router.post('/register', function(req, res){
    let username = req.body.username
    let password = req.body.password
    models.user.create({
        password : password,
        username : username
    }).then(function (result) {
        res.json({
            code : 1,
            data : result,
            msg : "ok"
        })
    }).catch(function (err) {
        console.log(err)
    })
})

module.exports = router
