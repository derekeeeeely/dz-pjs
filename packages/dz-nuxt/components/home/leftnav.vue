<template>
    <leftnav class="left">
        <div class="left-nav">
            <a href="/"><i class="iconfont icon-home"></i><span>home</span></a>
            <a href="/article/code/all"><i class="iconfont icon-code"></i><span>code</span></a>
            <a href="/article/life/all"><i class="iconfont icon-think"></i><span>think</span></a>
            <a href="/music"><i class="iconfont icon-music"></i><span>music</span></a>
            <a href="/us"><i class="iconfont icon-like"></i><span>us</span></a>
            <a href="/guest"><i class="iconfont icon-comment"></i><span>guest</span></a>
        </div>
    </leftnav>
</template>

<script>
    export default{
        name: 'left-nav',
        props:{

        },
        mounted() {
            if(process.BROWSER_BUILD){
                this.$nextTick(function () {
                })
            }
        }
    }
</script>

<style lang="less">
@media screen and (max-width: 600px) {
    .left{
        display: none;
    }
}
    .left{
        position: fixed;
        width: 9em;
        left: 1em;
        top: 4em;
        .left-nav{
            a{
                border: none;
                display: block;
                padding: 0 1em;
                height: 2.5em;
                line-height: 2.5em;
                text-decoration: none;
                text-transform: uppercase;
                border-radius: .25em;
                color: #bbb;
                font-family: CenturyGothic;
                margin: 1em 0;
                &:hover{
                    background: #777;
                    color: #fff;
                }
                i{
                    width: 1em;
                    margin-right: 1em;
                    display: inline-block;
                }
            }
        }
    }
</style>
