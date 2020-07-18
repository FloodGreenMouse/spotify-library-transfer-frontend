<template lang="pug">
  .snackbar-component(@mouseenter="isHovered = true" @mouseleave="restartTimer")
    transition(name="fadeDown")
      .content.flex.a-center(
        v-if="notification.show"
        @click="close"
        :class="classList")
        span {{ notification.text }}
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Snackbar',
  data () {
    return {
      notificationTimeout: null,
      isHovered: false
    }
  },
  watch: {
    notification () {
      this.setCloseTimer()
    }
  },
  computed: {
    ...mapState({
      notification: state => state.notification
    }),
    classList () {
      return this.notification.type ? this.notification.type : 'error'
    }
  },
  methods: {
    restartTimer () {
      this.isHovered = false
      this.setCloseTimer()
    },
    setCloseTimer () {
      clearTimeout(this.notificationTimeout)
      this.notificationTimeout = setTimeout(() => {
        if (!this.isHovered) {
          this.$store.dispatch('removeNotification')
        }
      }, this.notification.timeout)
    },
    close () {
      clearTimeout(this.notificationTimeout)
      this.$store.dispatch('removeNotification')
    }
  }
}
</script>

<style lang="scss">
  .snackbar-component {
    .close {
      @include svg(#ffffff);
      svg {
        width: 12px;
        height: 12px;
      }
    }
  }
</style>

<style lang="scss" scoped>
  .snackbar-component {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 100%;
    z-index: 100;

    .content {
      width: 100%;
      padding: 16px 18px;
      color: #ffffff;
      cursor: pointer;
      text-align: center;
      min-height: 48px;
      font-size: 15px;
      line-height: 1;
      box-shadow: 5px 8px 10px rgba(6, 8, 9, 0.46), -8px -6px 14px rgba(255, 255, 255, 0.04);
      span {
        flex: 1;
      }
      &.info {
        background-color: rgba(#199de6, 0.97);
      }
      &.success {
        background-color: rgba(#00D95F, 0.97);
      }
      &.error, &.danger {
        background-color: rgba(#F1635A, 0.97);
      }
    }
  }
</style>
