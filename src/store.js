import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    startAnimationEnabled: true,
    userInfo: null,
    notification: {
      type: 'error',
      timeout: 5000,
      text: '',
      show: false
    }
  },
  mutations: {
    ADD_NOTIFICATION (state, data) {
      state.notification = data
      state.notification.show = true
    },
    REMOVE_NOTIFICATION (state) {
      const notification = {
        type: 'error',
        timeout: 5000,
        text: '',
        show: false
      }
      state.notification = Object.assign({}, notification)
    },
    SET_USER_INFO (state, data) {
      state.userInfo = data
    },
    DISABLE_START_ANIMATION (state) {
      setTimeout(() => {
        state.startAnimationEnabled = false
      }, 1000)
    }
  },
  actions: {
    addNotification ({ commit }, data) {
      /*
      * @param {String} data.type - info, success, error/danger. Default - error
      * @param {String} data.text - default ''
      * @param {number} data.timeout - default 5000
      */
      if (!data.timeout || isNaN(data.timeout)) {
        data.timeout = 5000
      }
      if (!data.type || !['info', 'error', 'success'].includes(data.type)) {
        data.type = 'error'
      }
      if (!data.text) {
        data.text = ''
      }
      commit('ADD_NOTIFICATION', data)
    },
    removeNotification ({ commit }) {
      commit('REMOVE_NOTIFICATION')
    },
    setUserInfo ({ commit }, data) {
      commit('SET_USER_INFO', data)
    },
    disableStartAnimation ({ commit }) {
      commit('DISABLE_START_ANIMATION')
    }
  }
})
