<template>
    <div class="index">
        <article-list :articles="arts"/>
        <div class="comments"></div>
        <div class="add-comment"></div>
    </div>
</template>

<script>
import homeService from '../service/home'
import ArticleList from '../components/article/list'

export default{
    async data ( context ) {
        let homeData = await homeService.loadHomepage()
        return {
            arts: homeData.data,
            showComment: true,
            comments: null,
        }
    },
    components: {
        ArticleList
    },
    methods: {

    }
}
</script>
