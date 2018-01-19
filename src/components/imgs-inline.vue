<template>
  <div>
    <div class="imgWrap" ref="imgWrap">
      <img :src="it.thrumb" class="previewer-demo-img" v-for="(it,index) in list"  width="100%" :key="index" :data-index="index">
    </div>
    <h6>{{item.title}}({{list.length}})</h6>
    <div v-transfer-dom>
      <previewer :list="list" ref="previewer" :options="options" :title="item.title"></previewer>
    </div>
  </div>
</template>

<script>
// import Previewer from '@/components/previewer'
import { Previewer, TransferDomDirective as TransferDom } from 'vux'
export default {
  props: ['item'],
  data () {
    return {
      options: {
        getThumbBoundsFn (index) {
          let thumbnail = document.querySelectorAll('.previewer-demo-img')[index]
          let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
          let rect = thumbnail.getBoundingClientRect()
          return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
        }
      },
    }
  },
  computed: {
    list () {
      let array = []
      this.item.images.map((it) => {
        array.push({src: it.url, thrumb: it.url1})
      })
      return array
    }
  },
  directives: {
    TransferDom
  },
  components: {
    Previewer,
  },
  methods: {
    preview (i) {
      this.$refs.previewer.show(i)
    }
  },
  mounted () {
    this.$refs.imgWrap.addEventListener('touchstart', (e) => {
      let i = e.target.dataset.index
      this.preview(i)
    })
  }
}
</script>