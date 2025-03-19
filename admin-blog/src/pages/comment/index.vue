<script setup>
  import { ref, reactive, onMounted } from 'vue';
  import { message } from 'ant-design-vue';
  import { ArrowsAltOutlined } from '@ant-design/icons-vue';
  import { buildTree } from '@/utils/tree';
  import { getComment, isCommentCheck, delCommentId, searchComment } from '@/api/comment'
  import dayjs from 'dayjs';

  // 是否加载中
  const isLoading = ref(true);

  const formState = reactive({
    commentUserName: '',
    commentContent: '',
    type: undefined,
    isCheck: undefined,
  });

  // 构建好的树形数据
  const commentDataList = ref([]);

  async function onFinish(values) {
    isLoading.value = true;
    const params = {
      ...values,
      isCheck: values.isCheck !== undefined ? (values.isCheck === 1) : undefined,
    }
    await searchComment(params).then(res => {
      if (res.code === 0) {
        const mockCommentData = res.data;
        mockCommentData.forEach((item) => {
          item.createTime = dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss');
        })
        commentDataList.value = buildTree(mockCommentData);
        message.success('搜索成功');
      } else {
        message.error(res.msg);
      }
    })
    isLoading.value = false;
  }

  function onFinishFailed(errorInfo) {
    console.log('出现错误:', errorInfo);
  }

  const columns = ref([
    {
      title: '编号',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: '评论类型',
      dataIndex: 'type',
      align: 'center',
    },
    {
      title: '类型编号',
      dataIndex: 'typeId',
      align: 'center',
    },
    {
      title: '评论内容',
      dataIndex: 'commentContent',
      align: 'center',
    },
    {
      title: '评论用户',
      dataIndex: 'commentUserName',
      align: 'center',
    },
    {
      title: '是否通过',
      dataIndex: 'isCheck',
      align: 'center',
    },
    {
      title: '评论时间',
      dataIndex: 'createTime',
      align: 'center',
    },
    {
      title: '操作',
      key: 'operation',
      align: 'center',
    },
  ]);

  onMounted(async () => {
    await getCommentList();
  });

  /**
   * 获取评论列表
   */
  async function getCommentList() {
    await getComment().then((res) => {
      if (res.code === 0) {
        const mockCommentData = res.data;
        mockCommentData.forEach((item) => {
          item.createTime = dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss');
        })
        commentDataList.value = buildTree(mockCommentData);
      } else {
        message.error(res.msg)
      }
    })
    isLoading.value = false;
  }

  // 展开的行
  const expand = ref({
    expandedRowKeys: [],
    flag: false,
  });

  function onExpandAll() {
    if (expand.value.flag) {
      expand.value.expandedRowKeys = [];
      expand.value.flag = false;
    } else {
      expand.value.expandedRowKeys = commentDataList.value.map((item) => item.id);
      expand.value.flag = true;
    }
  }

  /**
   * 展开行
   * @param expanded 是否展开
   * @param record 当前行数据
   */
  function handleExpand(expanded, record) {
    if (expanded) {
      expand.value.expandedRowKeys.push(record.key);
    } else {
      const index = expand.value.expandedRowKeys.indexOf(record.key);
      if (index > -1) {
        expand.value.expandedRowKeys.splice(index, 1);
      }
    }
  }

  /**
   * 刷新
   */
  function refreshFunc() {
    isLoading.value = true;
    getCommentList();
  }

  // 是否通过
  async function updateIsCheckFunc(id, isCheck, record) {
    record.isCheckloading = true;
    await isCommentCheck({ id, isCheck }).then(async (res) => {
      if (res.code === 0) {
        message.success('操作成功');
        refreshFunc();
      } else {
        message.error(res.msg);
      }
    })
    record.isCheckloading = false;
  }

  // 删除
  async function onDelete(values) {
    await delCommentId(values).then(async (res) => {
      if (res.code === 0) {
        message.success('删除成功');
      } else {
        message.error(res.msg);
      }
    })
    refreshFunc();
  }

</script>

<template>
  <div class="comment">
    <div class="crumbs">
      <a-breadcrumb>
        <a-breadcrumb-item>网站管理</a-breadcrumb-item>
        <a-breadcrumb-item>评论管理</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <layoutTop :form-state="formState" @update:refreshFunc="refreshFunc" @update:onFinish="onFinish" @update:onFinishFailed="onFinishFailed">
      <template #form-items>
        <a-form-item label="评论用户" name="commentUserName">
          <a-input v-model:value="formState.commentUserName" placeholder="请输入评论用户" />
        </a-form-item>
        <a-form-item label="评论内容" name="commentContent">
          <a-input v-model:value="formState.commentContent" placeholder="请输入评论内容" />
        </a-form-item>
        <a-form-item label="评论类型" name="type" style="width: 240px">
          <a-select v-model:value="formState.type" placeholder="评论类型">
            <a-select-option :value="1">文章</a-select-option>
            <a-select-option :value="2">留言</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="是否通过" name="isCheck" style="width: 240px">
          <a-select v-model:value="formState.isCheck" placeholder="是否通过">
            <a-select-option :value="1">是</a-select-option>
            <a-select-option :value="0">否</a-select-option>
          </a-select>
        </a-form-item>
      </template>
      <template #operate-btn>
        <div>
          <a-button type="dashed" style="margin-bottom: 10px; color: grey" @click="onExpandAll">
            <template #icon>
              <ArrowsAltOutlined />
            </template>
            展开/折叠
          </a-button>
        </div>
      </template>

      <template #table-content>
        <div>
          <a-table :columns="columns" :data-source="commentDataList" :expanded-row-keys="expand.expandedRowKeys" :loading="isLoading" @expand="handleExpand">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'operation'">
                <a-popconfirm title="是否确定删除" ok-text="Yes" cancel-text="No" @confirm="onDelete(record)">
                  <a-button type="link" style="padding: 0">
                    <template #icon>
                      <DeleteOutlined />
                    </template>
                    <span style="margin-left: 3px">删除</span>
                  </a-button>
                </a-popconfirm>
              </template>
              <template v-if="column.dataIndex === 'isCheck'">
                <a-switch v-model:checked="record.isCheck" checked-children="是" un-checked-children="否" :loading="record.isCheckloading" @change="updateIsCheckFunc(record.id, record.isCheck, record)" />
              </template>
              <template v-if="column.dataIndex === 'type'">
                <a-tag color="blue">
                  {{ record.type === 1 ? '文章' : '留言' }}
                </a-tag>
              </template>
              <template v-if="column.dataIndex === 'typeId'">
                <a-tag>
                  {{ record.typeId }}
                </a-tag>
              </template>
              <template v-if="column.dataIndex === 'commentContent'">
                <a-popover title="评论">
                  <template #content>
                    {{ record.commentContent }}
                  </template>
                  {{ record.commentContent.length > 10 ? `${record.commentContent.substring(0, 10)}...` : record.commentContent }}
                </a-popover>
              </template>
              <template v-if="column.dataIndex === 'createTime'">
                <a-tooltip placement="top">
                  <template #title>
                    <span>{{ record.createTime }}</span>
                  </template>
                  {{ record.createTime.split(' ')[0] }}...
                </a-tooltip>
              </template>
            </template>
          </a-table>
        </div>
      </template>

    </layoutTop>
  </div>
</template>

<style lang="scss" scoped>
.comment{
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

.middle_btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.ant-select-arrow){
  padding-top: 0.8rem;
}

:deep(.ant-picker-suffix){
  padding-top: 0.45rem;
}
</style>