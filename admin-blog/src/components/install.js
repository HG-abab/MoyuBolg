// 引入项目中的全局组件
import SvgIcon from './SvgIcon/index.vue'
// 其他需要引入组件

// 将自定义组件放入对象中
const allGloablCom = {
  SvgIcon,
  // 其他需要引入组件
}
// 对外暴露插件对象
export default {
  // 只能叫做 install 方法
  install(app) {
    // 循环遍历，注册 allGloablCom 中全部组件
    Object.keys(allGloablCom).forEach((key) => {
      // 注册为全局组件
      app.component(key, allGloablCom[key])
    })
  },
}
