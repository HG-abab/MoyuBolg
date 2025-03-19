<script setup>
  import { ref, reactive, onMounted, computed, createVNode, h } from 'vue';
  import { Modal, message } from 'ant-design-vue';
  import {
    ExclamationCircleOutlined,
    PlusOutlined,
    FileSyncOutlined,
    DeleteOutlined,
    VerticalAlignBottomOutlined,
    TagOutlined
  } from '@ant-design/icons-vue';

  import dayjs from 'dayjs';
  import isBetween from 'dayjs/plugin/isBetween'
  import { getTagList, addTag, deleteTagList, updateTag, searchTag } from '@/api/tag'
  dayjs.extend(isBetween);

  // 表单数据
  const formState = reactive({
    tagName: undefined,
    time: undefined,
  });

  // 表格列配置
  const columns = [
    {
      title: '标签编号',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: '标签名称',
      dataIndex: 'tagName',
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

  // 加载状态
  const loading = ref(false);

  // 表格数据
  const tabData = ref([]);

  // 初始化加载数据
  onMounted(() => {
    refreshFunc();
  });

  // 刷新数据
  async function refreshFunc(searchData) {
    const res = await getTagList().then((res) => {
      if (res.code === 0) {
        tabData.value = res.data;
        // 格式化时间
        tabData.value.forEach((item) => {
          item.createTime = dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss');
          item.updateTime = dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss');
        })
      } else {
        message.error(res.message);
      }
    })
  }

  // 查询标签
  async function onFinish(values) {
    const submitData = {
      ...values,
    }
    if (values.time && values.time[0] && values.time && values.time[1]) {
      submitData.startTime = values.time[0].format('YYYY-MM-DD HH:mm:ss');
      submitData.endTime = values.time[1].format('YYYY-MM-DD HH:mm:ss');
    }
    loading.value = true;
    // 查询
    searchTag(submitData)
      .then((res) => {
        if (res.code === 0) {
          tabData.value = res.data;
          // 格式化时间
          tabData.value.forEach((item) => {
            item.createTime = dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss');
            item.updateTime = dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss');
          })
        } else {
          message.error(res.message);
        }
      })
      .catch((error) => {
        message.error('搜索请求失败: ' + error.message);  // 如果请求失败，展示错误消息
      })
      .finally(() => {
        loading.value = false;  // 无论成功还是失败，都停止加载
      });
  }

  // 表格状态
  const state = reactive({
    selectedRowKeys: [],
    loading: false,
  });

  // 选中行变化
  function onSelectChange(selectedRowKeys) {
    state.selectedRowKeys = selectedRowKeys;
  }

  const hasSelected = computed(() => state.selectedRowKeys.length === 1);

  // 模态框信息
  const modalInfo = reactive({
    open: false,
    title: '',
    loading: false,
  });

  // 表单数据
  const formData = ref({});

  // 删除标签
  function deleteTag(ids, type = 0) {
    if (type === 0) {
      Modal.confirm({
        title: '注意',
        icon: h(ExclamationCircleOutlined),
        content: `确定删除编号为 【${ids.join(',')}】 的标签吗？`,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          ids.forEach(async (id) => {
            await deleteTagList(id).then((res) => {
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
    }
  }

  // 添加或修改标签
  function updateOrInsertTag(id) {
    if (id) {
      const tagInfo = tabData.value.find((item) => item.id === id);
      formData.value = { ...tagInfo, id: String(tagInfo.id) };
      modalInfo.title = '修改标签';
    } else {
      formData.value = {};
      modalInfo.title = '添加标签';
    }
    modalInfo.open = true;
  }

  // 模态框确认
  async function modelOk() {
    modalInfo.loading = true;
    if (formData.value.id) {
      // 修改
      await updateTag(formData.value).then((res) => {
        if (res.code === 0) {
          message.success('修改成功');
        } else {
          message.error(res.msg);
        }
      })
    } else {
      // 添加
      await addTag(formData.value).then((res) => {
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
  <div class="tag">
    <div class="crumbs">
      <a-breadcrumb>
        <a-breadcrumb-item>网站管理</a-breadcrumb-item>
        <a-breadcrumb-item>标签管理</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <layoutTop :form-state="formState" @update:refresh-func="refreshFunc" @update:on-finish="onFinish">
      <template #form-items>
        <a-form-item label="标签名称" name="tagName">
          <a-input v-model:value="formState.tagName" placeholder="请输入标签名称" style="width: 250px" />
        </a-form-item>
        <a-form-item label="创建时间" name="time">
          <a-range-picker v-model:value="formState.time" :placeholder="['开始时间', '结束时间']" />
        </a-form-item>
      </template>

      <template #operate-btn>
        <a-button type="primary" @click="updateOrInsertTag()">
          <template #icon>
            <PlusOutlined />
          </template>
          新增
        </a-button>
        <a-button class="green" :disabled="!hasSelected" @click="updateOrInsertTag(state.selectedRowKeys[0])">
          <template #icon>
            <FileSyncOutlined />
          </template>
          修改
        </a-button>
        <a-button type="dashed" danger ghost :disabled=" !(state.selectedRowKeys.length > 0) " @click="deleteTag(state.selectedRowKeys, 0)">
          <template #icon>
            <DeleteOutlined />
          </template>
          删除
        </a-button>
      </template>

      <template #table-content>
        <a-modal v-model:open="modalInfo.open" :title="modalInfo.title" :confirm-loading="modalInfo.loading" width="400px" @ok="modelOk">
          <a-form-item label="标签名称" name="tagName">
            <a-input v-model:value="formData.tagName" placeholder="请输入标签名称" show-count :maxlength="20" />
          </a-form-item>
        </a-modal>
        <a-table :columns="columns" :data-source="tabData" :loading="loading" :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }" :row-key="record => record.id" size="small">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'tagName'">
              <a-tag color="blue">
                <TagOutlined /><span>{{ record.tagName }}</span>
              </a-tag>
            </template>
            <template v-if="column.dataIndex === 'articleCount'">
              <a-tag>
                {{ record.articleCount }}
              </a-tag>
            </template>
            <template v-if="column.key === 'operation'">
              <a-button type="link" style="padding: 0;" @click="updateOrInsertTag(record.id)">
                <template #icon>
                  <FileSyncOutlined />
                </template>
                <span style="margin-inline-start:1px">修改</span>
              </a-button>
              <a-popconfirm title="是否确定删除" ok-text="Yes" cancel-text="No" @confirm="deleteTag([record.id])">
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
.tag{
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