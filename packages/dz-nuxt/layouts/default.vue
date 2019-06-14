<template>
  <div class="derekzhou">
    <div class="global-bg">
      <div class="bg-img"></div>
    </div>
    <dheader/>
    <dleftnav/>
      <div class="main-container">
        <nuxt/>
      </div>
    <drightnav/>
    <dfooter/>
  </div>
</template>

<script>
import Dheader from '~components/header.vue'
import Dfooter from '~components/footer.vue'
import Dleftnav from '~components/home/leftnav'
import Drightnav from '~components/home/rightnav'

export default{
  components: {
    Dheader, Dfooter, Dleftnav, Drightnav
  }
}
</script>

<style lang="less">
  @import '~assets/less/base.less';
  @import '~assets/less/icon.less';
  .global-bg{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
    background-color: #24292e;
  }
  .bg-img{
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: .2;
    background: url('/static/background.jpg') 0 0 no-repeat;
    background-size: cover;
  }
  .main-container{
    position: relative;
    padding: 0 1em;
    overflow-y: scroll;
    margin: 2em 20em 0 11em;
  }
  @media screen and (max-width: 960px) {
      .main-container{
          margin-right: 2em;
      }
  }
  @media screen and (max-width: 600px) {
      .main-container{
          margin: 0;
          padding: 0;
      }
  }
</style>
