<template>
    <div class="article" >
        <div v-if="article" v-html="article.content"></div>
        <div v-else>nothing here</div>
    </div >
</template>

<script>
    export default{
        name: 'article-markdown',
        props: {
            article: {
                type: Object
            }
        }
    }
</script>

<style lang="less">
.article{
    padding: 1em;
    margin-bottom: 1em;
    background: #fff;
    overflow-y: scroll;
    overflow-x: hidden;
    padding-top: 0;
    a {
        color: #61BFC1;
        margin: 0;
        padding: 0;
        text-decoration: none;
        vertical-align: baseline;
    }
    h1{
        cursor: pointer;
    }

    a:hover {
        text-decoration: underline;
    }
    a:visited {
        color: #466B6C;
    }
    ul, ol {
        padding: 0;
        margin: 0;
    }
    ul{
        padding: 0 2em;
    }
    li {
        line-height: 24px;
    }
    li ul, li ul {
        margin-left: 24px;
    }
    p, ul, ol {
        font-size: 16px;
        line-height: 24px;
    }
    pre {
        padding: 0px 24px;
        white-space: pre-wrap;
        background-color: #f6f8fa;
        border-radius: 3px;
        padding: 1em;
        overflow-x: scroll;
    }
    code {
        font-family: Consolas, Monaco, Andale Mono, monospace;
        line-height: 1.5;
        font-size: 13px;
        color: #183691;
    }
    aside {
        display: block;
        float: right;
    }
    blockquote {
        border-left: .5em solid #eee;
        margin-left: 0;
        padding: 0 .5em;
        margin-right: 0;
    }
    blockquote  cite {
        font-size:14px;
        line-height:20px;
        color:#bfbfbf;
    }
    blockquote cite:before {
        content: '\2014 \00A0';
    }

    blockquote p {
        color: #666;
        overflow-x: scroll;
    }
    hr {
        text-align: left;
        margin: 0 auto 0 0;
        color: #999;
    }
    img{
        width: 100%;
    }
}
</style>
