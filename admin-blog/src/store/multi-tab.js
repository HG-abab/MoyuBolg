import router from '../router'
import { notification } from 'ant-design-vue'
import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'

const allowList = ['/login', '/404']

export const useMultiTab = defineStore('multi-tab', () => {
  // 多标签页列表
  const list = ref([])
  // 当前激活的tab
  const activeKey = shallowRef()
  // 刷新
  const refreshItem = ref(null)
  // 缓存
  const cacheList = ref([])

  const addItem = (route) => {
    if (!route) return
    if (route.path.startsWith('/redirect')) return
    if (allowList.includes(route.path)) return
    if (refreshItem.value) {
      setTimeout(() => {
        if (refreshItem.value) {
          refreshItem.value.loading = false
          refreshItem.value = null
        }
      }, 500)
    }
    if (list.value.some((item) => item.fullPath === route.fullPath)) {
      if (!cacheList.value.includes(route.name)) {
        if (route.name) cacheList.value.push(route.name)
      }
      return
    }
    const item = {
      path: route.path,
      fullPath: route.fullPath,
      title: route.meta.title,
      name: route.name,
      icon: route.meta.icon,
      affix: route.meta.affix,
      locale: route.meta.locale,
    }
    if (!cacheList.value.includes(item.name)) {
      if (route.name) cacheList.value.push(route.name)
    }
    list.value.push(item)
  }

  // 关闭
  const close = (key) => {
    if (list.value.length <= 1) {
      notification.error({
        message: '关闭标签失败',
        description: '不能关闭最后一个标签页',
        duration: 3,
      })
      return
    }
    const index = list.value.findIndex((item) => item.fullPath === key)
    if (index < 0) {
      notification.error({
        message: '关闭标签失败',
        description: '当前页签不存在',
        duration: 3,
      })
      return
    }
    const item = list.value[index]
    if (item.fullPath === activeKey.value) {
      const newItem = index === 0 ? list.value[index + 1] : list.value[index - 1]
      activeKey.value = newItem.fullPath
      router.push(newItem.fullPath)
    }
    if (item.name) cacheList.value = cacheList.value.filter((name) => name !== item.name)
    list.value = list.value.filter((item) => item.fullPath !== key)
  }

  // 切换标签
  const switchTab = (key) => {
    if (key === activeKey.value) return
    router.push(key)
  }

  // 一键关闭其他标签页
  const closeOther = (key) => {
    switchTab(key)
    list.value.forEach((item) => {
      if (item.affix) return
      if (item.fullPath === key) return
      close(item.fullPath)
    })
  }

  const closeLeft = (key) => {
    switchTab(key)
    const index = list.value.findIndex((item) => item.fullPath === key)
    const leftList = list.value.slice(0, index)
    leftList.forEach((item) => {
      if (item.affix) return
      close(item.fullPath)
    })
  }

  const closeRight = (key) => {
    switchTab(key)
    const index = list.value.findIndex((item) => item.fullPath === key)
    const rightList = list.value.slice(index + 1)
    rightList.forEach((item) => {
      if (item.affix) return
      close(item.fullPath)
    })
  }
  // 刷新
  const refresh = (key) => {
    const item = list.value.find((item) => item.fullPath === key)
    if (item) {
      cacheList.value = cacheList.value.filter((name) => name !== item.name)
      item.loading = true
      refreshItem.value = item
      router.push(`/redirect/${encodeURIComponent(item.fullPath)}`)
    }
  }

  const clear = () => {
    list.value = []
    cacheList.value = []
    activeKey.value = undefined
    refreshItem.value = null
  }
  return {
    list,
    activeKey,
    refreshItem,
    cacheList,
    addItem,
    close,
    switchTab,
    closeOther,
    closeLeft,
    closeRight,
    clear,
    refresh,
  }
})
