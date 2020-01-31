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
    members: null,
    allMembers: null,
    works: null,
    timetables: null
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
    MEMBERS (state, members) {
      state.members = members
    },
    ALL_MEMBERS_OF_BUSINESS (state, members) {
      state.allMembers = members
    },
    WORKS (state, works) {
      state.works = works
    },
    TIMETABLES (state, timetables) {
      state.timetables = timetables
    }
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
    MEMBERS ({ commit }) {
      return axios.get(`${baseURL}/api/v1/members/`, {
        headers: { 'Authorization': 'Token ' + this.state.token }
      }).then(res => {
        commit('MEMBERS', res.data)
      }).catch(err => console.log(err))
    },
    ALL_MEMBERS_OF_BUSINESS ({ commit }, businessId) {
      return axios.get(`${baseURL}/api/v1/members/all_members_of_business/?business=${businessId}`, {
        headers: { 'Authorization': 'Token ' + this.state.token }
      }).then(res => {
        commit('ALL_MEMBERS_OF_BUSINESS', res.data)
      }).catch(err => console.log(err))
    },
    TIMETABLES ({ commit }, businessId) {
      let url = `${baseURL}/api/v1/timetables`
      if (businessId) {
        url = `${url}/?business=${businessId}`
      }
      return axios.get(url, {
        headers: { 'Authorization': 'Token ' + this.state.token }
      }).then(res => {
        commit('TIMETABLES', res.data)
      }).catch(err => console.log(err))
    },
    WORKS ({ commit }, businessId, month) {
      let url = `${baseURL}/api/v1/works`
      if (businessId) {
        url = `${url}/?business=${businessId}`
      }
      return axios.get(url, {
        headers: { 'Authorization': 'Token ' + this.state.token }
      }).then(res => {
        commit('WORKS', res.data)
      }).catch(err => console.log(err))
    },
    ADDBUSINESS ({ commit }, form) {
      return axios.post(`${baseURL}/api/v1/businesses/`, form, {
        headers: { 'Authorization': 'Token ' + this.state.token }
      }).then(res => {
        commit('ADDMEMBER', res.data.member)
      })
    }
  },
  modules: {
  }
})
