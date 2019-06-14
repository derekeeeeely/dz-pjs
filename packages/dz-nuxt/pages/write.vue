<template>
    <div class="main-middle">
        <div class="upload">
            <p><input type="text" v-model="article.cover" placeholder="cover url"></p>
            <p><input type="text" v-model="article.title" placeholder="title"></p>
            <p><input type="text" v-model="article.abstract" placeholder="abstract"></p>
            <p><input type="text" v-model="article.type" placeholder="type"></p>
            <p><input type="text" v-model="article.tags" placeholder="tags"></p>
            <p><textarea name="" id="" cols="30" rows="10" v-model="article.content"></textarea></p>
            <p><button @click="upload">submit</button></p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default{
    // middleware: 'auth',
    data (){
        return {
            article: {
                cover: '',
                title: '',
                abstract: '',
                type: '',
                tags: '',
                content: ''
            }
        }
    },
    methods: {
        upload() {
            let params = this.article
            axios.post('/api/upload', {params})
            .then((res) => {
                // console.log(res.data)
                alert(res.data.msg)
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
    .main-middle{
        border-radius: 5px;
        padding: 0 1em;
        overflow-y: scroll;
        background: #fff;
        input{
            line-height: 2em;
            height: 2em;
            font-size: 1em;
            padding: 0 0.5em;
            border: 0;
            width: 16.4em;
            border: 1px solid #eee;
            border-radius: 0.25em;
        }
        textarea{
            width: 100%;
            overflow-y: scroll;
        }
        button{
            width: 80px;
            height: 30px;
            border: none;
            background: #ccc;
            color: #fff;
            cursor: pointer;
            &:focus{
                outline: none;
            }
        }
    }
</style>
