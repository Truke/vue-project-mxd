<template>
  <div id="app">
    <div class="flexLayout">
      <div class="headTop" v-if="showHead">
        <my-header :headData="headData"></my-header>
      </div>
      <div class="flexWrap">
        <transition name="router-fade" mode="out-in">
          <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
          </keep-alive>
        </transition>
        <transition name="router-fade" mode="out-in">
          <router-view v-if="!$route.meta.keepAlive"></router-view>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import './assets/css/reset.less'
import './assets/css/common.less'
export default {
  name: 'app',
  computed: {
    showHead () {
      return this.$store.state.headData.show && !this.$config.BrowserInfo.isWeixin
    },
    headData () {
      return this.$store.state.headData
    },
  },
}
</script>

<style lang="less">
.flexLayout{
  position: absolute;
  top:0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .headTop{
    height: 1.9rem;
  }
  .flexWrap{
    position: relative;
    flex: 1;
    overflow: auto;
  }
}
.router-fade-enter-active, .router-fade-leave-active {
  transition: opacity .3s;
}
.router-fade-enter, .router-fade-leave-active {
  opacity: 0;
}
</style>

