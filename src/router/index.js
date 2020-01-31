import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Business from '../views/Business.vue'
import AddBusiness from '../views/AddBusiness.vue'
import AddMember from '../views/AddMember.vue'
import AddTimetable from '../views/AddTimetable.vue'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import store from '../store/index.js'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', name: 'login', component: Login },
  { path: '/signup', name: 'signup', component: Signup }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => {
    return record.meta.requiresAuth
  })
  store.state.token = localStorage.getItem('token')
  if (!requiresAuth || store.state.token) {
    return next()
  }
  return next('/login')
})
export default router
