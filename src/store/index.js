import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

// const baseURL = 'http://albabasic-dev.us-west-2.elasticbeanstalk.com'
const baseURL = 'http://localhost:8000'

export default new Vuex.Store({
  state: {
    token: null,
    user: null,
  },
  mutations: {
    LOGIN (state, token) {
      state.token = token
    },
    LOGOUT (state) {
      state.token = null
      localStorage.removeItem('token')
    },
    USER (state, user) {
      state.user = user
    },
  },
  actions: {
    LOGIN ({ commit }, { username, password }) {
      return axios.post(`${baseURL}/rest-auth/login/`, { username, password })
        .then(res => {
          localStorage.setItem('token', res.data.key)
          commit('LOGIN', res.data.key)
        })
    },
    LOGOUT ({ commit }) {
      commit('LOGOUT')
    },
    SIGNUP ({ commit }, { username, password1, password2 }) {
      return axios.post(`${baseURL}/rest-auth/registration/`, { username, password1, password2 })
        .catch(e => {
          console.log(e)
          alert('회원가입에 실패했습니다.')
        })
    },
    USER ({ commit }) {
      return axios.get(`${baseURL}/api/v1/users/me/`, {
        headers: { 'Authorization': 'Token ' + this.state.token }
      }).then(res => {
        commit('USER', res.data)
      })
    },
  },
  modules: {
  }
})
