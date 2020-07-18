<template lang="pug">
  .button-component
    button(
      v-bind="$attrs"
      @click="click"
      :type="role"
      :class="classList"
      :disabled="isDisabled")
      .preloader(:class="{loading}")
        div
        div
        div
        div
      span(:class="{loading}")
        slot
</template>

<script>
import vPreloader from '../loader/preloader'

export default {
  name: 'button-component',
  components: {
    vPreloader
  },
  props: {
    type: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      default: 'button'
    },
    size: {
      type: String,
      default: ''
    },
    square: Boolean,
    loading: Boolean,
    fullwidth: Boolean,
    disabled: Boolean
  },
  computed: {
    isDisabled () {
      return this.loading || this.disabled
    },
    classList () {
      return `${this.type ? ' type-' + this.type : ''}${this.square ? ' square' : ''}${this.disabled ? ' disabled' : ''}${this.loading ? ' loading' : ''}${this.fullwidth ? ' fullwidth' : ''}${this.size ? ` size-${this.size}` : ''}`.trim()
    }
  },
  methods: {
    click () {
      if (!this.disabled && !this.loading) {
        this.$emit('click')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
 .button-component {
   display: inline-block;
   button {
     position: relative;
     color: #ffffff;
     border: 1px solid rgba(255, 255, 255, 0.2);
     margin: 0;
     cursor: pointer;
     background-color: rgba(0, 0, 0, 0.7);
     padding-left: 12px;
     padding-right: 12px;
     border-radius: 5px;
     height: 40px;
     min-width: 40px;
     transition: transform 0.1s ease;
     &.disabled {
       cursor: default;
     }
     span {
       font-size: 18px;
       opacity: 1;
       transition: opacity 0.2s ease;
       &.loading {
         opacity: 0;
       }
     }
   }
   .preloader {
     display: inline-block;
     position: absolute;
     left: 0;
     top: 0;
     width: 100%;
     height: 100%;
     opacity: 0;
     transition: opacity 0.3s ease;
     &.loading {
       opacity: 1;
     }
   }
   .preloader div {
     box-sizing: border-box;
     display: block;
     position: absolute;
     top: 0;
     left: 0;
     right: 0;
     bottom: 0;
     width: 20px;
     height: 20px;
     margin: auto;
     border: 2px solid #fff;
     border-radius: 50%;
     animation: preloader 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
     border-color: #fff transparent transparent transparent;
   }
   .preloader div:nth-child(1) {
     animation-delay: -0.45s;
   }
   .preloader div:nth-child(2) {
     animation-delay: -0.3s;
   }
   .preloader div:nth-child(3) {
     animation-delay: -0.15s;
   }
   @keyframes preloader {
     0% {
       transform: rotate(0deg);
     }
     100% {
       transform: rotate(360deg);
     }
   }
 }
</style>
