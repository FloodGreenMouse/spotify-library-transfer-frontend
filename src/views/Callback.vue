<template lang="pug">
  .page.callback
    .flex.column.center
      span.title Connecting to Spotify...
      .spotify-icon
        iconSpotify
</template>

<script>
import api from '@/api'
import iconSpotify from '../components/icons/iconSpotify'

export default {
  name: 'Callback',
  components: {
    iconSpotify
  },
  mounted () {
    // query
    // error=access_denied&state=STATE
    const code = this.$route.query.code || null
    if (code) {
      const params = {
        code
      }
      api().get('/get-access-token', { params })
        .then(res => {
          localStorage.setItem('access_token', res.data.access_token)
          localStorage.setItem('refresh_token', res.data.refresh_token)
          setTimeout(() => {
            this.$router.push('/')
          }, 1000)
        }).catch(err => {
          console.warn('Error', err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  .page.callback {
    padding-top: 50px;
    .title {
      display: block;
      margin-bottom: 32px;
      font-size: 32px;
      font-weight: 900;
    }
    .spotify-icon {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      animation: pulse 1s ease infinite;
      svg {
        width: 100%;
      }
    }
    @keyframes pulse {
      0% {
        transform: scale(0.90);
        box-shadow: 0 0 0 0 rgba(#00D95F, 0.7);
      }
      70% {
        transform: scale(1.01);
        box-shadow: 0 0 0 10px rgba(#00D95F, 0);
      }
      100% {
        transform: scale(0.90);
        box-shadow: 0 0 0 0 rgba(#00D95F, 0);
      }
    }
  }
</style>
