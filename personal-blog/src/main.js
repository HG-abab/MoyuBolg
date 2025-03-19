import { createApp } from 'vue'
import App from './App.vue'
// import store from './store/index'
import router from './router/index'
import ElementPlus from 'element-plus'
import 'virtual:svg-icons-register'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import './assets/style/index.scss'
// 黑暗模式
import 'element-plus/theme-chalk/dark/css-vars.css'
// svg组件
import SvgIcon from './components/svgIcon/index.vue'
// 指令
import vSlideIn from '@/utils/v-Slide-in.js'
// 图片懒加载
import Lazyload from 'vue3-lazyload'
// 图片查看
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' //引入持久化插件

const app = createApp(App)
// app.use(store)
app.use(router)
app.use(ElementPlus)

app.directive('slide-in', vSlideIn)

app.component('Svg-icon', SvgIcon)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(Lazyload, {
  loading: 'https://ts1.cn.mm.bing.net/th/id/R-C.953ed8c05902a48f647b521947886328?rik=WgLNh%2bqlpugRpg&riu=http%3a%2f%2fbid.cncecyc.com%2fopeninghall%2fimages%2floading.gif&ehk=z3EsmE%2b7REu7Yiu5ZK2V9MaZFgCZMCT8UJKLujrBNQ4%3d&risl=&pid=ImgRaw&r=0', //可以指定加载中的图像
  error: 'https://pic.616pic.com/ys_bnew_img/00/26/91/0vKNj9s4be.jpg', //可以指定加载失败的图像
})
app.mount('#app')

// 图片查看
app.use(Viewer, {
  Options: {
    inline: true,
    button: true, //右上角按钮
    navbar: true, //底部缩略图
    title: true, //当前图片标题
    toolbar: true, //底部工具栏
    tooltip: true, //显示缩放百分比
    movable: true, //是否可以移动
    zoomable: true, //是否可以缩放
    rotatable: true, //是否可旋转
    scalable: true, //是否可翻转
    transition: true, //使用 CSS3 过度
    fullscreen: true, //播放时是否全屏
    keyboard: true, //是否支持键盘
    url: 'data-source',
  },
})
