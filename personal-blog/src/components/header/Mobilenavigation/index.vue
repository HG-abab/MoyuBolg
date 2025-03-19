<template>
  <div>
    <el-menu style="width: 100%;border: none" class="menu">
      <el-menu-item index="1" class="index" @click="isClose;$router.push('/')">
        <el-icon>
          <HomeFilled />
        </el-icon>
        首页
      </el-menu-item>
      <el-sub-menu index="2">
        <template #title>
          <el-icon>
            <Files />
          </el-icon>
          归档
        </template>
        <el-menu-item index="2-1" @click="isClose;$router.push('/')">
          <el-icon>
            <Clock />
          </el-icon>
          时间轴
        </el-menu-item>
        <el-menu-item index="2-2" @click="isClose;$router.push('/category')">
          <el-icon>
            <CopyDocument />
          </el-icon>
          分类
        </el-menu-item>
        <el-menu-item index="2-3" @click="isClose;$router.push('/tabs')">
          <el-icon>
            <Discount />
          </el-icon>
          标签
        </el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="3">
        <template #title>
          <el-icon>
            <IceCreamRound />
          </el-icon>
          其他
        </template>
        <el-menu-item index="3-1" @click="isClose;$router.push('/')">
          <el-icon>
            <Fries />
          </el-icon>
          树洞
        </el-menu-item>
        <el-menu-item index="3-2" @click="isClose;$router.push('/')">
          <el-icon>
            <EditPen />
          </el-icon>
          留言板
        </el-menu-item>
      </el-sub-menu>
      <el-menu-item index="4" @click="isClose;$router.push('/')">
        <el-icon>
          <Link />
        </el-icon>
        友链
      </el-menu-item>
      <el-menu-item index="5" @click="isClose;$router.push('/')">
        <el-icon>
          <Headset />
        </el-icon>
        音乐
      </el-menu-item>
      <el-menu-item index="6" @click="isClose;$router.push('/')">
        <el-icon>
          <Tools />
        </el-icon>
        关于
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
  import { defineEmits, onMounted } from "vue"
  import { IceCreamRound, Fries, Postcard, Link, Headset, UserFilled, EditPen } from "@element-plus/icons-vue"
  import { useRouter } from "vue-router"

  onMounted(() => {
    const router = useRouter()
  })
  const emit = defineEmits("Jump:closeDrawer")

  function isClose() {
    emit("Jump:closeDrawer")
  }
</script>

<style scoped lang="scss">
</style>