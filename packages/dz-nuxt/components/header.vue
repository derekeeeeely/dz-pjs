<template>
  <my-header>
        <div class="nav">
            <div class="title">
                <img src="/static/logo.png" alt="">
                <span class="name" @click=''>DerekZhou</span>
                <span class="slogan">Talk is cheap, show me the code!</span>
                <a href="/"></a>
            </div>
        </div>
  </my-header>
</template>

<style lang="less">
.nav{
    width: 100%;
    height: 3em;
    background: #24292e;
    overflow-x: hidden;
    .title{
        margin: .5em 2em;
        position: relative;
        height: 2em;
        a{
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
        }
        img{
            width: 2em;
            height: 2em;
            border-radius: 1em;
        }
        span{
            display: inline-block;
            vertical-align: top;
            height: 2em;
            line-height: 3em;
            font-size: 1em;
            margin-left: 2em;
            color: #ccc;
            &.name{
                line-height: 2em;
                margin-left: 0.5em;
                font-size: 1.25em;
                color: #fff;
            }
        }
    }
}
</style>
