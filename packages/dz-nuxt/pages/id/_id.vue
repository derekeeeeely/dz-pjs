<template>
    <div class="detail">
        <article-markdown :article="articles"/>
    </div>
</template>

<script>
import searchService from '../../service/search'
import ArticleMarkdown from '../../components/article/detail'

export default{
    async data ( context ) {
        let id = context.route.params.id
        let articleData = await searchService.loadArticleById(id)
        return {
            articles: articleData.data.data
        }
    },
    components: {
        ArticleMarkdown
    }
}
</script>
