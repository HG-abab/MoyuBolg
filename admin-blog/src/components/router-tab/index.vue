<script setup>
  import {
    CloseOutlined,
    MoreOutlined,
    ReloadOutlined,
  } from '@ant-design/icons-vue'
  import { listenerRouteChange, removeRouteListener } from '../../utils/router-listener'
  import { useMultiTab } from '../../store/multi-tab'
  import { storeToRefs } from 'pinia'
  import { computed, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'


  const multiTabStore = useMultiTab()
  const { list, activeKey } = storeToRefs(multiTabStore)
  const router = useRouter()

  const isCurrentDisabled = computed(() => {
    return (
      list.value.length === 1 || list.value.filter((item) => !item.affix).length <= 1
    )
  })

  function leftDisabled(key) {
    // 判断左侧是否还有可关闭的
    const index = list.value.findIndex(item => item.fullPath === key)
    return index === 0 || list.value.filter(item => !item.affix).length <= 1
  }

  function rightDisabled(key) {
    // 判断右侧是否还有可关闭的
    const index = list.value.findIndex(item => item.fullPath === key)
    return (
      index === list.value.length - 1 || list.value.filter(item => !item.affix).length <= 1
    )
  }

  // 关闭逻辑
  function handleSwitch(event, current) {
    const { key } = event
    if (key === 'closeCurrent')
      multiTabStore.close(activeKey.value)
    else if (key === 'closeLeft')
      multiTabStore.closeLeft(current)
    else if (key === 'closeRight')
      multiTabStore.closeRight(current)
    else if (key === 'closeOther')
      multiTabStore.closeOther(current)
    else if (key === 'refresh')
      multiTabStore.refresh(activeKey.value)
  }

  const otherDisabled = computed(() => {
    return (
      list.value.length === 1 || list.value.filter(v => !v.affix).length <= 1
    )
  })

  listenerRouteChange((router) => {
    const item = list.value.find(item => item.fullPath === router.fullPath)
    if (router.fullPath === activeKey.value && !item.loading) return
    activeKey.value = router.fullPath
    multiTabStore.addItem(router)
  }, true)

  onUnmounted(() => {
    removeRouteListener()
  })
</script>

<template>
  <div class="div" />
  <a-tabs :active-key="activeKey" type="card" size="small" :tabBarGutter="5" @update:active-key="multiTabStore.switchTab">
    <a-tab-pane v-for="item in list" :key="item.fullPath">
      <template #tab>
        <a-dropdown :trigger="['contextmenu']">
          <div>
            {{ item.title }}
            <button v-if="activeKey === item.fullPath" class="ant-tabs-tab-remove" style="margin: 0" @click.stop="multiTabStore.refresh(item.fullPath)">
              <ReloadOutlined :spin="item.loading" />
            </button>
            <button v-if="!item.affix && list.length > 1" class="ant-tabs-tab-remove" style="margin: 0" @click.stop="multiTabStore.close(item.fullPath)">
              <CloseOutlined />
            </button>
          </div>
          <template #overlay>
            <a-menu @click="handleSwitch($event, item.fullPath)">
              <a-menu-item key="closeCurrent" :disabled="isCurrentDisabled || activeKey !== item.fullPath">
                关闭当前
              </a-menu-item>
              <a-menu-item key="closeLeft" :disabled="isCurrentDisabled || leftDisabled(item.fullPath)">
                关闭左侧
              </a-menu-item>
              <a-menu-item key="closeRight" :disabled="isCurrentDisabled || rightDisabled(item.fullPath)">
                关闭右侧
              </a-menu-item>
              <a-menu-item key="closeOther" :disabled="isCurrentDisabled || otherDisabled">
                关闭其他
              </a-menu-item>
              <a-menu-item key="refresh" :disabled="!isCurrentDisabled">
                刷新当前
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </a-tab-pane>
    <template #leftExtra>
      <div style="width: 1rem" />
    </template>
    <template #rightExtra>
      <div class="router-tab-right-extra">
        <a-dropdown :trigger="['hover']">
          <MoreOutlined />
          <template #overlay>
            <a-menu @click="handleSwitch($event, activeKey)">
              <a-menu-item key="closeOther" :disabled="isCurrentDisabled || otherDisabled">
                关闭其他
              </a-menu-item>
              <a-menu-item key="refresh">
                刷新当前
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </template>
  </a-tabs>
</template>


<style lang="scss" scoped>
.router-tab-right-extra{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 0.5rem;
}
.div{
  height: 0.5rem;
  background-color: #fff !important;
}

:deep(.ant-tabs-nav){
  background-color: #fff;
  margin: 0;
}

.ant-dropdown-trigger{
  display: flex;
  height: 100%;
  align-items: center;
}
.ant-tabs-tab-remove{
  margin-left: 0.2rem !important;
  margin-top: -0.2rem !important;

}


</style>