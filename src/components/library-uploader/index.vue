<template lang="pug">
.library-uploader-component
  input(@input="getFile" type="file" accept=".xml" ref="fileInput" hidden)
  vButton(@click="openFileDialog") Загрузить библиотеку *.xml
</template>

<script>
import vButton from '../button'

export default {
  components: {
    vButton
  },
  data () {
    return {
      file: null,
      mediaLibrary: []
    }
  },
  methods: {
    openFileDialog () {
      this.$refs.fileInput.click()
    },
    getFile (e) {
      this.file = e.target.files[0]
      const fileReader = new FileReader()
      const fileExtension = this.file.name.split('.').pop()
      fileReader.onloadend = () => {
        const result = fileReader.result
        if (fileExtension.toLowerCase() === 'xml') {
          this.parseLibrary(result)
        }
      }
      fileReader.readAsText(this.file)
    },
    parseLibrary (content) {
      const iTunesAlbums = content.match(/<key>Album<\/key><string>(.*)<\/string>/gi)
      const iTunesArtist = content.match(/<key>Artist<\/key><string>(.*)<\/string>/gi)
      const iTunesGenres = content.match(/<key>Genre<\/key><string>(.*)<\/string>/gi)

      const albums = this.getParsedValues(iTunesAlbums)
      const artists = this.getParsedValues(iTunesArtist)
      const genres = this.getParsedValues(iTunesGenres)

      const parsedLibrary = []

      albums.forEach((item, i) => {
        parsedLibrary.push({
          album: item,
          artist: artists[i],
          genre: genres[i]
        })
      })

      this.mediaLibrary = this.deleteDuplicatesAndPodcasts(parsedLibrary)

      this.$emit('updateLibrary', this.mediaLibrary)
    },
    getParsedValues (data) {
      const items = []
      data.forEach(item => {
        const value = /<string>(.*)<\/string>/gi.exec(item)[1]
        items.push(value)
      })
      return items
    },
    deleteDuplicatesAndPodcasts (data) {
      const uniqueItems = []
      data.forEach(item => {
        const isUnique = uniqueItems.find(uniq => uniq.album === item.album)
        if (!isUnique) {
          uniqueItems.push(item)
        }
      })
      const albums = []
      uniqueItems.forEach(item => {
        if (item.genre) {
          if (item.genre !== 'Подкаст' && item.genre !== 'Podcast') {
            albums.push(item)
          }
        }
      })
      return albums
    }
  }
}
</script>

<style lang="scss" scoped>
  .library-uploader-component {}
</style>
