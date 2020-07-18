<template lang="pug">
.page.home
  h1.title Трансфер медиатеки Apple Music -> Spotify
  .user-info.flex.a-center(v-if="userInfo && showUserInfo")
    a(:href="userInfo.external_urls.spotify" target="_blank")
    img(:src="userInfo.images[0].url")
    span {{ userInfo.display_name }}
  .logout.flex.center(v-if="userInfo && showUserInfo")
    button(@click="logout")
      iconLogout
  .flex.center.column
    .auth-button(v-if="!userInfo")
      vButton(
        @click="getAuthLink"
        :loading="showAuthLinkLoading"
        :disabled="showAuthLinkLoading") Авторизоваться в Spotify
    libraryUploader(v-if="userInfo" @updateLibrary="updateLibrary")
    p(v-if="mediaLibrary.length") Загружено альбомов: {{ mediaLibrary.length || 0 }}
    .search-button
      vButton(
        v-if="mediaLibrary.length && showSearchButton"
        @click="searchAlbums"
        :loading="isLoading"
        :disabled="isLoading") Найти альбомы в Spotify
  transition(name="fade")
    .library-explorer(v-if="searchItems.length")
      libraryExplorer(:items="searchItems" :offset="offset")
  .more-button.flex.center
    vButton(
      v-if="searchItems.length && !showSearchButton && showSearchMoreButton"
      @click="searchAlbums"
      :loading="isLoading"
      :disabled="isLoading") Загрузить еще
</template>

<script>
import api from '@/api'
import { mapState } from 'vuex'
import vButton from '../components/button'
import vPreloader from '../components/loader/preloader'
import libraryUploader from '../components/library-uploader'
import libraryExplorer from '../components/library-explorer'
import iconLogout from '../components/icons/iconLogout'

export default {
  components: {
    vButton,
    vPreloader,
    libraryUploader,
    libraryExplorer,
    iconLogout
  },
  data () {
    return {
      mediaLibrary: [],
      searchItems: [],
      offset: 0,
      showSearchButton: true,
      isLoading: false,
      showAuthLinkLoading: false,
      accessToken: null,
      refreshToken: null,
      showUserInfo: false,
      showSearchMoreButton: true
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    })
  },
  methods: {
    logout () {
      api().get('/logout')
        .then(() => {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          window.location.reload()
        })
        .catch(err => {
          console.warn('Error', err)
        })
    },
    getAuthLink () {
      api().get('/login')
        .then(res => {
          window.location.replace(res.data)
          console.log(res.data)
        })
        .catch(err => {
          console.warn('Error', err)
        })
    },
    updateLibrary (data) {
      this.mediaLibrary = Object.assign([], data)
    },
    async searchAlbums () {
      this.isLoading = true
      const requests = []
      for (let i = this.offset; i < this.offset + 24; i++) {
        if (this.mediaLibrary[i]) {
          const params = {
            artist: this.mediaLibrary[i].artist,
            album: this.mediaLibrary[i].album
          }
          requests.push(api().get('/get-album', { params }))
        } else {
          this.showSearchMoreButton = false
        }
      }
      try {
        if (requests.length) {
          const responses = await Promise.all(requests)
          responses.forEach(res => {
            if (res.data.albums.items.length) {
              this.searchItems.push(res.data.albums.items[0])
            }
          })
          this.showSearchButton = false
          this.offset += 24
        }
      } catch (err) {
        console.warn('Error', err)
      } finally {
        this.isLoading = false
      }
    }
  },
  mounted () {
    api().get('/whoami')
      .then(res => {
        this.$store.dispatch('setUserInfo', res.data)
        this.showUserInfo = true
        // console.log(res)
      }).catch(err => {
        console.warn('Error', err)
      })
  }
}
</script>

<style lang="scss">
  .page.home {
    .logout {
      @include svg($color-text);
    }
  }
</style>

<style lang="scss" scoped>
 .page.home {
   padding: 40px 0;
   .user-info {
     left: 0;
     &:hover {
       span {
         text-decoration: underline;
       }
     }
     a {
       position: absolute;
       left: 0;
       top: 0;
       width: 100%;
       height: 100%;
     }
     img {
       width: 51px;
       border-radius: 50%;
       margin-right: 12px;
     }
   }
   .logout {
     right: 0;
     button {
       width: 40px;
       margin: 0;
       padding: 0;
       cursor: pointer;
       background-color: transparent;
       border: 0;
       svg {
         width: 100%;
       }
     }
   }
   .user-info, .logout {
     position: absolute;
     animation: user-info 1s 0.5s ease 1 forwards;
     top: -100px;
     background-color: #282828;
     padding: 17px 15px 12px 15px;
     border-radius: 5px;
     box-shadow: 2px 3px 16px rgba(7, 7, 9, 0.6), inset -2px -2px 12px rgba(255, 255, 255, 0.06);
   }
   .title {
     margin-top: 0;
     margin-bottom: 40px;
     text-align: center;
   }
   .search-button, .auth-button {
     margin-bottom: 20px;
   }
   @keyframes user-info {
     0% {
       top: -200px
     }
     100% {
       top: -5px;
     }
   }
 }
</style>
