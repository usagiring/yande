import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Posts = () => import('../components/Posts.vue')

export default new Router({
  routes: [
    {
      path: '/',
      name: 'posts',
      component: Posts
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
