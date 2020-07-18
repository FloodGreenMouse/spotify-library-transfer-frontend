<template lang="pug">
  .album-card-component
    .image
      img(:src="getImage" :title="getArtists")
    .artist
      span {{ getArtists }}
    .album
      span {{ getAlbumName }}
    .menu.flex.column.center(:class="{'loading': isLoading}")
      transition(name="fade" :duration="200" mode="out-in")
        .delete-button(v-if="isAdded" :key="0")
          vButton(
            @click="removeAlbum"
            :disabled="isLoading"
            :loading="isLoading")
            iconTrash
        .add-button(v-if="!isAdded" :key="1")
          vButton(
            @click="addAlbum"
            :disabled="isLoading"
            :loading="isLoading") +
      .link(v-if="!!getExternalLink")
        a(:href="getExternalLink" target="_blank")
          iconSpotify
</template>

<script>
import api from '@/api'
import vButton from '../button'
import iconTrash from '../icons/iconTrash'
import iconSpotify from '../icons/iconSpotify'

export default {
  name: 'album-card-component',
  components: {
    vButton,
    iconTrash,
    iconSpotify
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      isLoading: false,
      isAdded: false
    }
  },
  computed: {
    getArtists () {
      let artists = ''
      this.item.artists.forEach((artist, i) => {
        if (i === 0) {
          artists += artist.name
        } else {
          artists += `, ${artist.name}`
        }
      })
      return artists
    },
    getImage () {
      return this.item.images[1].url
    },
    getAlbumName () {
      return this.item.name
    },
    getExternalLink () {
      return this.item.external_urls.spotify || ''
    }
  },
  methods: {
    addAlbum () {
      this.isLoading = true
      const params = {
        id: this.item.id
      }
      api().get('/add-album', { params })
        .then(() => {
          this.isAdded = true
          this.$store.dispatch('addNotification', {
            type: 'success',
            text: `Альбом "${this.getAlbumName}" добавлен в медиатеку`
          })
        })
        .catch(err => {
          this.$store.dispatch('addNotification', {
            text: 'Возникла ошибка. Пожалуйста, попробуйте еще раз.'
          })
          console.warn('Error', err)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    removeAlbum () {
      this.isLoading = true
      const params = {
        id: this.item.id
      }
      api().get('/remove-album', { params })
        .then(() => {
          this.isAdded = false
          this.$store.dispatch('addNotification', {
            type: 'success',
            text: `Альбом "${this.getAlbumName}" удален из медиатеки`
          })
        })
        .catch(err => {
          this.$store.dispatch('addNotification', {
            text: 'Возникла ошибка. Пожалуйста, попробуйте еще раз.'
          })
          console.warn('Error', err)
        })
        .finally(() => {
          this.isLoading = false
        })
    }
  }
}
</script>

<style lang="scss">
  .album-card-component {
    .delete-button {
      @include svg($color-text);
    }
  }
</style>

<style lang="scss" scoped>
  .album-card-component {
    margin-bottom: 16px;
    position: relative;
    padding: 15px 10px;
    // background-color: aqua;
    background: linear-gradient(327.43deg, #32383E -77.68%, #17191C 87.35%);
    box-shadow: 5px 8px 10px rgba(6, 8, 9, 0.46), -8px -6px 14px rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 5px;
    transition: border-color 0.3s ease;
    animation: album-card 0.3s ease 1 forwards;
    &:hover {
      border: 1px solid rgba(255, 255, 255, 0.1);
      .menu {
        opacity: 1;
      }
    }
    .image {
      display: flex;
      align-items: center;
      max-width: 100%;
      justify-content: center;
      box-shadow: 2px 3px 16px rgba(7, 7, 9, 0.6), inset -2px -2px 12px rgba(255, 255, 255, 0.06);
      overflow: hidden;
      border-radius: 5px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      margin-bottom: 12px;
      img {
        border-radius: 5px;
        width: 100%;
      }
    }
    .artist span, .album span {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      display: block;
    }
    .artist {
      margin-bottom: 10px;
    }
    .delete-button {
      svg {
        width: 20px;
        path {
          fill: #ffffff;
        }
      }
    }
    .add-button {
      display: block;
    }
    .link {
      margin-top: 20px;
      a {
        color: inherit;
        text-decoration: none;
        line-height: 1;
        svg {
          height: 30px;
          width: 30px;
        }
      }
    }
    .menu {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(3px);
      border-radius: 3px;
      opacity: 0;
      transition: opacity 0.3s ease;
      &.loading {
        opacity: 1;
      }
    }
  }
</style>
