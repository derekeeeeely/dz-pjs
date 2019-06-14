<template>
    <rightnav class="right">
        <div class="search">
            <input type="text" placeholder="Search...">
            <i class="iconfont icon-search"></i>
        </div>
        <div class="hot">
            <i class="iconfont icon-list"></i>
            <span>热门文章</span>
        </div>
        <div class="aside-calendar">
            <calendar></calendar>
        </div>
    </rightnav>
</template>

<script>
    import Calendar from '../calendar.vue'
    export default{
        components: {
            Calendar
        }
    }
</script>

<style lang="less">
@media screen and (max-width: 960px) {
    .right{
        display: none;
    }
}
.right{
    position: fixed;
    right: 2em;
    top: 5em;
    width: 17.4em;
    .search{
        margin-bottom: 2em;
        input{
            line-height: 2em;
            height: 2em;
            font-size: 1em;
            padding: 0 0.5em;
            border: 0;
            width: 16.4em;
            background: #bbb;
            border-radius: 0.25em;
            &:focus{
                background: #fff;
            }
        }
        i{
            position: absolute;
            top: 0.5em;
            right: 0.5em;
        }
    }
    .hot{
        color: #bbb;
        margin-bottom: 2em;
        i{
            margin-right: 0.5em;
        }
    }
}
</style>
