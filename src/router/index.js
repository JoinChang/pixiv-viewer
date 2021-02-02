import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Main',
      component: () => import('@/components/Main'),
      meta: {
        keepAlive: true,
        isBack: false
      }
    },
    {
      path: '/u/:id/',
      name: 'Member',
      component: () => import('@/components/Member')
    },
    {
      path: '/member/:id/',
      name: 'Member',
      component: () => import('@/components/Member')
    },
    {
      path: '/users/:id/',
      name: 'Member',
      component: () => import('@/components/Member')
    },
    {
      path: '/i/:id/',
      name: 'Illust',
      component: () => import('@/components/Illust')
    },
    {
      path: '/artworks/:id/',
      name: 'Illust',
      component: () => import('@/components/Illust')
    },
    {
      path: '/about/',
      name: 'About',
      component: () => import('@/components/About')
    },
    {
      path: '/settings/',
      name: 'Settings',
      component: () => import('@/components/Settings')
    },
    {
      path: '/user/bookmark_new_illusts',
      name: 'MeFollowingWorks',
      component: () => import('@/components/user/MeFollowingWorks'),
      meta: {
        keepAlive: true,
        isBack: false
      }
    },
    {
      path: '/user/discovery',
      name: 'IllustRecommended',
      component: () => import('@/components/user/IllustRecommended'),
      meta: {
        keepAlive: true,
        isBack: false
      }
    }
  ]
})
