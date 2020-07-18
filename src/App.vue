<template lang="pug">
  #app
    vSnackbar(v-model="snackbar" :type="snackType") {{ snackText }}
    transition(name="loader")
      vLoader(v-if="showLoader && !isCallbackPage")
    transition(name="fade" :duration="200" mode="out-in")
      router-view
</template>

<script>
import vSnackbar from './components/snackbar'
import vLoader from './components/loader'
import { mapState } from 'vuex'

export default {
  components: {
    vSnackbar,
    vLoader
  },
  data () {
    return {
      snackbar: false,
      snackType: '',
      snackText: '',
      showLoader: true
    }
  },
  computed: {
    ...mapState({
      loaded: state => state.startAnimationEnabled
    }),
    isCallbackPage () {
      return this.$route.path.includes('/callback')
    }
  },
  mounted () {
    setTimeout(() => {
      this.showLoader = false
      this.$store.dispatch('disableStartAnimation')
    }, 500)
  }
}
</script>

<style lang="scss">
  body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
  }
</style>
