<script setup>
  import { ref, reactive, onMounted, h } from 'vue';
  import { Modal, message } from 'ant-design-vue';
  import { ExclamationCircleOutlined, MessageOutlined, DeleteOutlined, LinkOutlined } from '@ant-design/icons-vue';
  import dayjs from 'dayjs';
  import 'md-editor-v3/lib/style.css';
  import { MdPreview } from 'md-editor-v3';
  import isBetween from 'dayjs/plugin/isBetween'
  import { getMessageList, updateStatus, deleteMessage, searchMessage } from '@/api/message'

  dayjs.extend(isBetween);

  // 表单数据
  const formData = reactive({
    userName: undefined,
    isCheck: undefined,
    time: undefined,
  });

  // 表格状态
  const state = reactive({
    selectedRowKeys: [], // 选中的行
    loading: false,
  });


  // 加载状态
  const loading = ref(false);

  // 表格数据
  const tabData = ref([]);

  // 选中表格
  function onSelectChange(selectedRowKeys) {
    state.selectedRowKeys = selectedRowKeys
  }

  const columns = [
    {
      title: '编号',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: '留言用户',
      dataIndex: 'userName',
      align: 'center',
    },
    {
      title: '留言内容',
      dataIndex: 'content',
      align: 'center',
    },
    {
      title: '是否通过',
      dataIndex: 'isCheck',
      align: 'center',
    },
    {
      title: '留言时间',
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
      align: 'center',
    },
  ]
  // 初始化加载数据
  onMounted(async () => {
    await refreshFunc();
  });

  // 刷新数据
  async function refreshFunc() {
    loading.value = true;
    await getMessageList().then(res => {
      if (res.code === 0) {
        tabData.value = res.data;
        tabData.value.forEach(item => {
          item.createTime = dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss');
          item.updateTime = dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss');
        })
      } else {
        message.error(res.message);
      }
    })
    loading.value = false;
  }

  // 查找留言
  async function onFinish(values) {
    loading.value = true;
    const submitData = {
      ...values,
      isCheck: values.isCheck !== undefined ? (values.isCheck === 1) : undefined,
      startTime: values.time && values.time.length > 0 ? dayjs(values.time[0]).format('YYYY-MM-DD HH:mm:ss') : undefined,
      endTime: values.time && values.time.length > 0 ? dayjs(values.time[1]).format('YYYY-MM-DD HH:mm:ss') : undefined,
    }
    await searchMessage(submitData).then((res) => {
      if (res.code === 0) {
        tabData.value = res.data;
        tabData.value.forEach(item => {
          item.createTime = dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss');
          item.updateTime = dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss');
        })
      } else {
        message.error(res.message);
      }
    })
    loading.value = false;
  }


  // 更新审核状态
  async function updateIsCheckFunc(id, isCheck, record) {
    record.isCheckloading = true;
    updateStatus({
      id,
      isCheck
    }).then(async (res) => {
      if (res.code === 0) {
        message.success('操作成功');
        await refreshFunc()
      } else {
        message.error(res.message);
      }
    })
    record.isCheckloading = false;
  }

  // 删除留言
  function onDelete(ids) {
    if (ids) {
      ids.forEach((id) => {
        deleteMessage(id).then(async (res) => {
          if (res.code === 0) {
            message.success('删除成功');
            await refreshFunc()
          } else {
            message.error(res.message);
          }
        })
      })
    } else {
      // 批量删除
      const ids = state.selectedRowKeys;
      Modal.confirm({
        title: '注意',
        icon: h(ExclamationCircleOutlined),
        content: `确定删除编号为 【${ids.join(',')}】 的留言吗？`,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          ids.forEach((id) => {
            deleteMessage(id).then(async (res) => {
              if (res.code === 0) {
                message.success('删除成功');
                await refreshFunc()
              } else {
                message.error(res.message);
              }
            })
          })
        },
      });
    }
  }

  // 查看留言
  const contentModel = reactive({
    show: false,
    content: '',
  });

  function viewFunc(id) {
    if (!id) id = state.selectedRowKeys[0];
    contentModel.show = true;
    contentModel.content = tabData.value.find((item) => item.id === id)?.content;
  }

</script>

<template>
  <div class="message">
    <div class="crumbs">
      <a-breadcrumb>
        <a-breadcrumb-item>网站管理</a-breadcrumb-item>
        <a-breadcrumb-item>留言管理</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <layoutTop :form-state="formData" @update:refresh-func="refreshFunc" @update:on-finish="onFinish">
      <template #form-items>
        <a-form-item label="用户名称" name="userName" style="margin-right: 1rem">
          <a-input v-model:value="formData.userName" placeholder="输入留言用户" style="width: 15em" />
        </a-form-item>
        <a-form-item label="是否通过" name="isCheck" style="margin-right: 1rem">
          <a-select v-model:value="formData.isCheck" style="width: 13em" placeholder="是否通过">
            <a-select-option :value="1">
              是
            </a-select-option>
            <a-select-option :value="0">
              否
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="创建时间" name="time">
          <a-range-picker v-model:value="formData.time" :placeholder="['开始时间', '结束时间']" />
        </a-form-item>
      </template>

      <template #operate-btn>
        <a-button type="default" style="margin-right: 10px" :disabled="state.selectedRowKeys.length !== 1" @click="viewFunc()">
          <template #icon>
            <MessageOutlined />
          </template>
          查看
        </a-button>
        <a-button type="dashed" danger ghost :disabled="state.selectedRowKeys.length === 0" @click="onDelete()">
          <template #icon>
            <DeleteOutlined />
          </template>
          删除
        </a-button>
        <!-- 查看框 -->
        <a-modal v-model:open="contentModel.show" width="700px">
          <template #title>
            <span style="color: #1677FF">
              <MessageOutlined />
            </span><span style="margin-left: 0.2rem">查看留言</span>
          </template>
          <template #footer>
            <a-button @click="contentModel.show = false">
              关闭
            </a-button>
          </template>
          <MdPreview v-model="contentModel.content" />
        </a-modal>
      </template>

      <template #table-content>
        <a-table :columns="columns" :data-source="tabData" :loading="loading" :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }" :row-key="record => record.id" size="small">
          <template #bodyCell="{ column, record }">

            <template v-if="column.dataIndex === 'isCheck'">
              <a-switch v-model:checked="record.isCheck" checked-children="是" un-checked-children="否" :loading="record.isCheckloading" @change="updateIsCheckFunc(record.id, record.isCheck, record)" />
            </template>

            <template v-if="column.dataIndex === 'content'">
              {{ record.content.length > 7 ? `${record.content.slice(0, 7)}...` : record.content }}
            </template>

            <template v-if="column.dataIndex === 'operation'">
              <a-button type="link" style="padding: 0" @click="viewFunc(record.id)">
                <template #icon>
                  <MessageOutlined />
                </template>
                <span style="margin-left: 3px">查看</span>
              </a-button>
              <a-popconfirm title="是否确定删除" ok-text="Yes" cancel-text="No" @confirm="onDelete([record.id])">
                <a-button type="link" style="padding: 0">
                  <template #icon>
                    <DeleteOutlined />
                  </template>
                  <span style="margin-left: 3px">删除</span>
                </a-button>
              </a-popconfirm>
            </template>
            <template v-if="column.dataIndex === 'createTime'">
              <a-tooltip placement="top">
                <template #title>
                  <span>{{ record.createTime }}</span>
                </template>
                {{ record.createTime.split(' ')[0] }}...
              </a-tooltip>
            </template>
            <template v-if="column.dataIndex === 'updateTime'">
              <a-tooltip placement="top">
                <template #title>
                  <span>{{ record.updateTime }}</span>
                </template>
                {{ record.updateTime.split(' ')[0] }}...
              </a-tooltip>
            </template>
          </template>
        </a-table>
      </template>

    </layoutTop>
  </div>
</template>

<style lang="scss" scoped>
.message{
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