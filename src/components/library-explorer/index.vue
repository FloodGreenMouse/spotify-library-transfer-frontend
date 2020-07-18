<template lang="pug">
  .library-explorer-component
    .album-cards
      .flex.wrap
        .col.col-2(v-for="(item, i) in items" :key="i")
          .album-card
            album-card(:item="item")
</template>

<script>
import albumCard from './album-card'

export default {
  name: 'library-explorer-component',
  components: {
    albumCard
  },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    offset: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style lang="scss">
  .library-explorer-component {
    @keyframes album-card {
      0% {
        transform: translateY(-50px);
        opacity: 0;
      }
      100% {
        transform: translateY(0px);
        opacity: 1;
      }
    }
  }
</style>

<style lang="scss" scoped>
  .library-explorer-component {
    padding-bottom: 20px;
  }
</style>
