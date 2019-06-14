<template>
    <div class="list">
        <div v-if="articles" v-for="article in articles" class="art" >
            <a @click="goDetail(article.id)">{{article.title}}</a>
            <p>{{article.abstract}}</p>
            <span v-if="article.tags"><span class="tags" v-for="item in article.tags.split('+')">{{item}}</span></span>
            <i class="iconfont icon-star" @click="star($event, article)"></i>
            <a class="str">{{article.stars}}</a>
        </div >
    </div>
</template>

<script>
import axios from 'axios'
    export default{
        name: 'article-list',
        props: {
            articles: {
                type: Array,
                default: [
                    {}
                ]
            }
        },
        methods: {
            goDetail(item) {
                location.href = '/id/' + item
            },
            star(event, article){
                let opt = (event.target.getAttribute('class') == 'iconfont icon-star yes')? false: true
                let starClass = opt?'iconfont icon-star yes':'iconfont icon-star'
                let params = {
                    id: article.id,
                    stars: opt?(++article.stars):(--article.stars)
                }
                axios.post('/api/starOpt', {params})
                .then((res) => {
                    if(res.data.code == 1){
                        event.target.setAttribute('class', starClass)
                    }
                })
                .catch((error) => {
                  if (error.response.status === 401) {
                    throw new Error('Bad credentialssss')
                  }
                })
            }
        }
    }
</script>

<style lang="less">
    .art{
        padding: 1em;
        margin-bottom: 1em;
        background: #fff;
        overflow-y: scroll;
        overflow-x: hidden;
        max-height: 8em;
        position: relative;
        text-align: center;
        a{
            cursor: pointer;
            margin: 0;
            font-size: 1.25em;
            color: #000;
        }
        p{
            margin: 0;
            text-align: center;
        }
        span.tags{
            display: inline-block;
            padding: 0.25em 0.5em;
            border-radius: .25em;
            background: #f1f8ff;
            color: #0366d6;
            float: left;
            margin-top: .25em;
            margin-right: .25em;
            &:hover{
                background: #ddeeff;
            }
        }
        i{
            position: absolute;
            bottom: 1em;
            right: 2.5em;
            color: #ccc;
            &.yes{
                color: #000;
            }
        }
        a.str{
            position: absolute;
            width: 1.5em;
            border: none;
            right: 1em;
            bottom: 1.0625em;
            font-size: 1em;
            color: #0366d6;
        }
    }
    @media screen and (max-width: 600px) {
        .art{
            border-bottom: 0.5em solid #eee;
            margin-bottom: 0;
        }
    }
</style>
