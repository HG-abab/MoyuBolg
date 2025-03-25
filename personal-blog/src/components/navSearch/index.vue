<script setup>
  import { ref, onMounted } from 'vue';
  import { ElMessage } from 'element-plus'
  import { getTopArticle, deleteSearchHistory, getSearchHistory, getArticleBySearch } from '@/api/article'
  import router from '@/router'
  import { useUserStore } from '@/stores/User'
  const userStore = useUserStore()

  const input = ref('')
  const showSearch = ref('false')
  const optionsValue = ref('标题')
  const options = ['标题', '内容']
  const placeholder = ref('请输入搜索内容')
  const showSearchText = ref('请输入要搜索的内容')
  const TopArticle = ref([])

  const TopArticleList = async () => {
    await getTopArticle().then(res => {
      if (res.code === 0) {
        TopArticle.value = res.data
      } else {
        ElMessage.error(res.message)
      }
    })
  }
  const refresh = async () => {
    TopArticleList()
  }

  const checktagList = ref([])
  const getchecktagList = async () => {
    await getSearchHistory({
      userName: userStore.username
    }).then(res => {
      if (res.code === 0) {
        checktagList.value = res.data
      } else {
        ElMessage.error(res.message)
      }
    })
  }
  const deleteHistory = async () => {
    await deleteSearchHistory({
      userName: userStore.username
    }).then(async res => {
      if (res.code === 0) {
        ElMessage.success('清除成功')
        await getchecktagList()
      } else {
        ElMessage.error(res.message)
      }
    })
  }

  const handleChangeTag = async (e) => {
    input.value = e.content;
    showSearch.value = false
    const type = showSearchText.value === '请输入要搜索的内容' ? 1 : 2
    await getArticleBySearch({
      type,
      Content: input.value,
      userName: e.userName
    }).then(res => {
      if (res.code === 0) {
        searchList.value = res.data
        console
      } else {
        ElMessage.error(res.message)
      }
    })
    await getchecktagList()
  }

  onMounted(async () => {
    await TopArticleList()
    await getchecktagList()
  })

  const handleChange = (e) => {
    if (e === '标题') {
      input.value = ''
      placeholder.value = '请输入搜索内容'
      showSearch.value = false
      showSearchText.value = '请输入要搜索的内容'
    } else {
      input.value = ''
      placeholder.value = '回车进行内容搜索'
      showSearch.value = false
      showSearchText.value = '内容搜索每分钟只能5次'
    }
  }

  // 搜索内容
  const searchList = ref([])
  const handleSearch = async () => {
    if (input.value === '') {
      return;
    }
    const type = showSearchText.value === '请输入要搜索的内容' ? 1 : 2
    await getArticleBySearch({
      type,
      Content: input.value,
      userName: userStore.username
    }).then(async res => {
      if (res.code === 0) {
        searchList.value = res.data
        console
      } else {
        ElMessage.error(res.message)
      }
    })
    await getchecktagList()
  }

  const clickSearchResult = (id) => {
    router.push({
      path: `/article/${id}`,
    })
  }

</script>

<template>
  <div class="content_container">
    <!-- 搜索框内容 -->
    <div class="search">
      <el-input v-model="input" @change="handleSearch" @focus="showSearch = false" @blur="showSearch = true" size="large" style="font-size:16px;" :placeholder="placeholder">
        <template #prefix>
          <svgIcon name="search" height="24" width="24" />
        </template>
        <template #suffix>
          <div class="custom-style">
            <el-segmented block v-model="optionsValue" @change="handleChange" :options="options" size="small" />
          </div>
        </template>
      </el-input>
    </div>
    <template v-if="showSearch">
      <div class="search_history">
        <!-- 搜索 -->
        <div class="header_history">
          <div>
            搜索历史
          </div>
          <div class="event_history" @click="deleteHistory">
            <div class="icon">
              <el-icon>
                <Delete />
              </el-icon>
            </div>
            <span>清除记录</span>
          </div>
        </div>
      </div>
      <!-- 历史记录 -->
      <div v-for="item in checktagList" :key="item.id" style="display: inline-flex">
        <el-check-tag @change="handleChangeTag(item)" checked type="primary" style="margin-left: 0.75rem; margin-top: 0.4rem ;margin-bottom: 0.4rem ;width: auto;height: 1.8rem;display: flex;align-items: center;justify-content: center; font-size:0.8rem; border-radius:5px;">
          {{item.content}}
        </el-check-tag>
      </div>
      <div class="header_history" style="margin-bottom: 0.4rem;">
        <div>置顶文章</div>
        <div class="event_history" @click="refresh">
          <div class="icon">
            <el-icon>
              <Loading />
            </el-icon>
          </div>
          <span>刷新</span>
        </div>
      </div>
      <div class="recommend_container" v-for="item in TopArticle" :key="item.id">
        <div @click="$router.push('/article/' + item.id)" style="width: 100%;display: flex;align-items: center;justify-content: space-between;">
          <div class="text">
            {{item.articleTitle}}
          </div>
          <div class="icon">
            <div class="text">
              <svgIcon name="heat" height="20" width="20" />
              <span>{{item.visitCount}}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div v-if="searchList.length === 0" class="showSearchText"> {{showSearchText}}</div>
      <div class="search_result">
        <template v-if="searchList && showSearchText === '请输入要搜索的内容'">
          <div v-for="item in searchList" :key="item.id" @mousedown="clickSearchResult(item.id)">
            <div class="search_result_item">
              <div>
                <div v-html="item.articleTitle"></div>
                <div class="text-xs mt-1 dark:text-[#A3A3A3] p-1">
                  <el-tag size="small" class="mr-2">
                    {{ item.categoryName }}
                  </el-tag>
                </div>
              </div>
              <div class="flex space-x-2 text-xs text-[#475569] items-center justify-center">
                <SvgIcon name="heat" />
                <span>{{ item.visitCount }}</span>
              </div>
            </div>
          </div>
        </template>
        <template v-if="searchList && showSearchText !== '请输入要搜索的内容'">
          <div v-for="item in searchList" :key="item.id" @mousedown="clickSearchResult(item.id)">
            <div class="search_result_item">
              <div>
                <div v-html="item.articleTitle"></div>
                <div class="text-xs mt-1 dark:text-[#A3A3A3] p-1 flex">
                  <div>
                    <el-tag size="small" class="mr-2">
                      {{ item.categoryName }}
                    </el-tag>
                  </div>
                  <div v-html="item.articleContent.slice(0, 30)">
                  </div>
                </div>
              </div>
              <div class="flex space-x-2 text-xs text-[#475569] items-center justify-center">
                <SvgIcon name="heat" />
                <span>{{ item.visitCount }}</span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>


<style lang="scss" scoped>

  .el-segmented {
    --el-segmented-item-selected-color: var(--el-bg-color);
    --el-segmented-item-selected-bg-color: #ff8787;
    --el-border-radius-base: 16px;
    font-size: 0.8em;
    color: grey;
  }

  .header_history{
    display: flex;
    font-size: 1.1rem;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    font-weight: bold;
    .event_history{
      display: flex;
      align-items: center;
      .icon{
        margin-top: 2px;
      }
      span{
      margin-left: 5px;
      }
      &:hover{
        cursor: pointer;
        color: #FE2C55FF;
        transition: color 0.3s linear;
      }
    }
  }

  .recommend_container{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px;
    margin: 0 5px;
    border-radius: 5px;
    font-size: 1rem;
    &:hover{
      cursor: pointer;
      color: #FE2C55FF;
      background-color: #e0e2e5;
      transition: background-color 0.3s linear;
      }
      .icon{
        font-size: 0.8rem;
        .text{
          display: flex;
          align-items: center;
        }
        span{
          margin-left: 0.4rem;
        }
      }
  }
  :deep(.el-input__wrapper){
    padding: 0 4px;
  }
  .el-check-tag{
    font-size: 8px;
    background-color: #e0e2e5;
    border-radius: 2px;
    padding: 2px 8px ;
  }
  .showSearchText{
    font-size: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px;
  }

   .search_result {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    margin-top: 1rem;

    .search_result_item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    & > div {
      padding: 5px;
      cursor: pointer;
    }

    & > div:hover {
      background-color: #e0e2e5;
      transition: background-color 0.3s linear;
    }
  }
</style>