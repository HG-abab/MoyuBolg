<script setup>
  import { message, Modal } from "ant-design-vue";
  import { computed, createVNode, onMounted, reactive, ref } from "vue";
  import { ExclamationCircleOutlined, DeleteOutlined, FileSyncOutlined, PlusOutlined } from '@ant-design/icons-vue'
  import moment from 'moment';
  import { getcategoryList, addcategory, deletecategoryList, updatecategory, searchcategory } from "@/api/category";
  import dayjs from "dayjs";

  const formState = reactive({
    categoryName: undefined,
    time: undefined,
  });

  const columns = [
    {
      title: '分类编号',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: '分类名称',
      dataIndex: 'categoryName',
      align: 'center',
    },
    {
      title: '文章数量',
      dataIndex: 'articleCount',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
    },
  ];

  const loading = ref(false);
  const tabData = ref([]);

  onMounted(async () => {
    await refreshFunc();
  })


  async function refreshFunc() {
    loading.value = true;
    getcategoryList().then((res) => {
      if (res.code === 0) {
        tabData.value = res.data;
        tabData.value.forEach((item) => {
          item.createTime = dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss');
          item.updateTime = dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss');
        })
      } else {
        message.error(res.msg)
      }
    }).finally(() => {
      loading.value = false;
    })
  }

  async function onFinish(values) {
    const submitData = { ...values };
    if (values.time && values.time[0] && values.time[1]) {
      Object.assign(submitData, {
        startTime: values.time[0].format('YYYY-MM-DD HH:mm:ss'),
        endTime: values.time[1].format('YYYY-MM-DD HH:mm:ss'),
      });
    }

    loading.value = true;
    // 搜索功能
    await searchcategory(submitData).then((res) => {
      if (res.code === 0) {
        tabData.value = res.data;
        tabData.value.forEach((item) => {
          item.createTime = dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss');
          item.updateTime = dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss');
        })
      } else {
        message.error(res.msg)
      }
    }).finally(() => {
      loading.value = false;
    })
  }

  const state = reactive({
    selectedRowKeys: [],
    loading: false,
  });

  const hasSelected = computed(() => state.selectedRowKeys.length > 0 && state.selectedRowKeys.length === 1);


  function onSelectChange(selectedRowKeys) {
    state.selectedRowKeys = selectedRowKeys;
  }

  const modalInfo = reactive({
    open: false,
    title: '',
    loading: false,
  });

  const formData = ref();

  function deleteCategory(ids, type = 0) {
    if (type === 0) {
      Modal.confirm({
        title: '注意',
        icon: createVNode(ExclamationCircleOutlined),
        content: `确定删除编号为 【${ids.join(',')}】 的分类吗？`,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          // 模拟删除功能
          ids.forEach(async (id) => {
            await deletecategoryList(id).then((res) => {
              if (res.code === 0) {
                message.success('删除成功');
              } else {
                message.error(res.msg);
              }
            })
            refreshFunc();
          })
          state.selectedRowKeys = [];
        },
      });
      return;
    }
  }

  async function updateOrInsertCategory(id) {
    if (id) {
      // 修改
      const categoryInfo = tabData.value.find((item) => item.id === id);
      formData.value = { ...categoryInfo, id: String(id) };
      modalInfo.open = true;
      modalInfo.title = '修改分类';
    } else {
      // 添加
      formData.value = {};
      modalInfo.open = true;
      modalInfo.title = '添加分类';
    }
  }

  async function modelOk() {
    modalInfo.loading = true;
    if (formData.value.id) {
      // 更新分类
      await updatecategory(formData.value).then((res) => {
        if (res.code === 0) {
          message.success('修改成功');
        } else {
          message.error(res.msg);
        }
      })
    } else {
      // 新增分类
      await addcategory(formData.value).then((res) => {
        if (res.code === 0) {
          message.success('添加成功');
        } else {
          message.error(res.msg);
        }
      })
    }
    modalInfo.loading = false;
    modalInfo.open = false;
    await refreshFunc();
  }

</script>

<template>
  <div class="category">
    <div class="crumbs">
      <a-breadcrumb>
        <a-breadcrumb-item>网站管理</a-breadcrumb-item>
        <a-breadcrumb-item>分类管理</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <layoutTop :form-state="formState" @update:refresh-func="refreshFunc" @update:on-finish="onFinish">
      <template #form-items>
        <a-form-item label="分类名称" name="categoryName">
          <a-input v-model:value="formState.categoryName" placeholder="请输入分类名称" style="width: 250px" />
        </a-form-item>
        <a-form-item label="创建时间" name="time">
          <a-range-picker v-model:value="formState.time" :placeholder="['开始时间', '结束时间']" />
        </a-form-item>
      </template>

      <template #operate-btn>
        <a-button type="primary" @click="updateOrInsertCategory()">
          <template #icon>
            <PlusOutlined />
          </template>
          新增
        </a-button>
        <a-button class="green" :disabled="!hasSelected" @click="updateOrInsertCategory(state.selectedRowKeys[0])">
          <template #icon>
            <FileSyncOutlined />
          </template>
          修改
        </a-button>
        <a-button type="dashed" danger ghost :disabled="!(state.selectedRowKeys.length > 0)" @click="deleteCategory(state.selectedRowKeys, 0)">
          <template #icon>
            <DeleteOutlined />
          </template>
          删除
        </a-button>
      </template>

      <template #table-content>
        <a-modal v-model:open="modalInfo.open" :title="modalInfo.title" :confirm-loading="modalInfo.loading" width="400px" @ok="modelOk">
          <a-form-item label="分类名称" name="categoryName">
            <a-input v-model:value="formData.categoryName" placeholder="请输入分类名称" show-count :maxlength="20" />
          </a-form-item>
        </a-modal>
        <a-table :columns="columns" :data-source="tabData" :loading="loading" :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }" :row-key="record => record.id" size="small">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'categoryName'">
              <a-tag color="#2db7f5">
                {{ record.categoryName }}
              </a-tag>
            </template>
            <template v-if="column.dataIndex === 'articleCount'">
              <a-tag>
                {{ record.articleCount }}
              </a-tag>
            </template>
            <template v-if="column.key === 'operation'">
              <a-button type="link" style="padding: 0;" @click="updateOrInsertCategory(record.id)">
                <template #icon>
                  <FileSyncOutlined />
                </template>
                <span style="margin-inline-start:1px">修改</span>
              </a-button>
              <a-popconfirm title="是否确定删除" ok-text="Yes" cancel-text="No" @confirm="deleteCategory([record.id])">
                <a-button type="link" style="padding: 0;margin-left: 5px">
                  <template #icon>
                    <DeleteOutlined />
                  </template>
                  <span style="margin-inline-start:1px">删除</span>
                </a-button>
              </a-popconfirm>
            </template>
            <template v-else-if="column.key === 'icon'">
              <!-- 图标 -->
              <component :is="record.icon" />
            </template>
          </template>
        </a-table>
      </template>

    </layoutTop>
  </div>
</template>

<style lang="scss" scoped>
.category{
  background: white;
  min-height: 50vh;
  margin-bottom: 5rem;
  .crumbs {
    padding: 1rem;
    h1{
      margin-top: 1rem;
      font-size: 1.2rem;
      font-weight: 500;
    }
  }
}

:deep(.ant-select-arrow){
  padding-top: 0.8rem;
}

:deep(.ant-picker-suffix){
  padding-top: 0.45rem;
}
</style>