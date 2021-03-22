import Vue from 'vue'
import Router from 'vue-router'
import Signin from '@/components/Signin.vue'
import Signup from '@/components/Signup.vue'
import Songs from '@/components/songs/Songs.vue'
import Artists from '@/components/artists/Artists.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Signin',
      component: Signin
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/artists',
      name: 'Artists',
      component: Artists
    },
    {
      path: '/songs',
      name: 'Songs',
      component: Songs
    },
  ]
})
