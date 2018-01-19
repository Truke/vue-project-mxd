<template>
  <div class="flexLayout">
    <div class="flexWrap">
      <transition>
        <router-view></router-view>
      </transition>
    </div>
    <div class="footNav">
      <my-footer isFixed="true" @goTo="goTo" active="true"></my-footer>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goTo(url){
      this.$root.goUrl(url);
    },
  }
}
</script>

<style lang="less">

</style>