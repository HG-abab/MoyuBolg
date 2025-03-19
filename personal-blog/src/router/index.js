// router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'layout',
    component: () => import('../view/layout/index.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('../view/Home/index.vue'),
      },
      {
        path: 'category/:id?',
        name: 'category',
        component: () => import('../view/Pigeonhole/category/index.vue'),
      },
      {
        path: 'tabs/:id?',
        name: 'tabs',
        component: () => import('../view/Pigeonhole/tabs/index.vue'),
      },
      {
        path: 'timeline',
        name: 'timeline',
        component: () => import('../view/timeline/index.vue'),
      },
      {
        path: 'Treeholes',
        name: 'Treeholes',
        component: () => import('../view/Treeholes/index.vue'),
      },
      {
        path: '/concerning',
        name: 'Concerning',
        component: () => import('../view/Concerning/index.vue'),
      },
      {
        path: '/Friendchains',
        name: 'Friendchains',
        component: () => import('../view/Friendchains/index.vue'),
      },
      {
        path: '/photoa',
        name: 'photoa',
        component: () => import('../view/photoa/index.vue'),
      },
      {
        path: '/user',
        name: 'user',
        component: () => import('../view/user/Profile.vue'),
      },
      {
        path: 'Message',
        name: 'Message',
        component: () => import('../view/Messageboards/index.vue'),
        children: [
          {
            path: '',
            name: 'MessageList',
            component: () => import('../view/Messageboards/MessageList/index.vue'),
          },
          {
            path: '/Message/detail/:id?',
            name: 'Messagedetail',
            component: () => import('../view/Messageboards/Messagedetail/index.vue'),
          },
        ],
      },
    ],
  },
  {
    //文章
    path: '/article/:id',
    name: 'article',
    component: () => import('../view/Articles/index.vue'),
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
export default router // 确保这里有一个默认导出
