import { createRouter, createWebHistory } from 'vue-router'
import { setRouteEmitter } from '../utils/router-listener'

const routes = [
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录',
    },
    component: () => import('../pages/Login/index.vue'),
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/home/index.vue'),
    children: [
      {
        path: '',
        name: 'info',
        meta: {
          title: '信息管理',
        },
        component: () => import('../pages/info/index.vue'),
      },
      {
        path: '/list',
        name: 'list',
        meta: {
          title: '文章列表',
        },
        component: () => import('../pages/list/index.vue'),
      },
      {
        path: '/publish',
        name: 'publish',
        meta: {
          title: '发布文章',
        },
        component: () => import('../pages/publish/index.vue'),
      },
      {
        path: '/message',
        name: 'message',
        meta: {
          title: '留言管理',
        },
        component: () => import('../pages/message/index.vue'),
      },
      {
        path: '/tag',
        name: 'tag',
        meta: {
          title: '标签管理',
        },
        component: () => import('../pages/tag/index.vue'),
      },
      {
        path: '/category',
        name: 'category',
        meta: {
          title: '分类管理',
        },
        component: () => import('../pages/category/index.vue'),
      },
      {
        path: '/collect',
        name: 'collect',
        meta: {
          title: '收藏管理',
        },
        component: () => import('../pages/collect/index.vue'),
      },
      {
        path: '/comment',
        name: 'comment',
        meta: {
          title: '评论管理',
        },
        component: () => import('../pages/comment/index.vue'),
      },
      {
        path: '/tree-hole',
        name: 'tree-hole',
        meta: {
          title: '树洞管理',
        },
        component: () => import('../pages/tree-hole/index.vue'),
      },
      {
        path: '/redirect/:path(.*)',
        name: 'redirect',
        meta: {
          title: '重定向',
        },
        component: () => import('../pages/redirect/index.vue'),
      },
    ],
  },
  {
    path: '/404',
    name: '404',
    meta: {
      title: '页面丢失',
    },
    component: () => import('../pages/Failurehandling/index.vue'),
  },
  // 重定向
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  setRouteEmitter(to)
  next()
})
export default router // 确保这里有一个默认导出
