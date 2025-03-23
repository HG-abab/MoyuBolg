<script setup>
import { ref, reactive, onMounted, createVNode } from 'vue';
import { Modal, message, Button, Table, Switch, Tooltip, Popconfirm } from 'ant-design-vue';
import { ExclamationCircleOutlined, DeleteOutlined, EditOutlined, MessageOutlined } from '@ant-design/icons-vue';
import { deleteUser, getUserById, getUserList, isSuperAdmin } from '../../api/users';

const usersData = ref([]);

onMounted(() => {
  refreshFunc()
})

const state = reactive({
  selectedRowKeys: [],
  loading: false,
});

const userModal = reactive({
  show: false,
  currentUser: null,
});

const formData = reactive({
  userName: undefined,
});

async function refreshFunc() {
  const res = await getUserList();
  if (res.code === 0) {
    usersData.value = res.data;
  } else {
    message.error(res.msg);
  }
}

async function onFinish(values) {


}

const columns = [
  { title: 'ID', dataIndex: 'id', align: 'center' },
  { title: '用户名', dataIndex: 'name', align: 'center' },
  { title: '邮箱', dataIndex: 'email', align: 'center' },
  { title: '登录方式', dataIndex: 'provider', align: 'center' },
  { title: '头像', dataIndex: 'avatar', align: 'center' },
  { title: '管理员权限', dataIndex: 'isAdmin', align: 'center' },
  { title: '操作', dataIndex: 'operation', align: 'center' },
];

function onSelectChange(selectedRowKeys) {
  state.selectedRowKeys = selectedRowKeys;
}

async function onDelete(ids) {
  Modal.confirm({
    title: '确认删除',
    icon: createVNode(ExclamationCircleOutlined),
    content: `确定要删除ID为${ids}的用户吗？`,
    okText: '确认',
    cancelText: '取消',
    onOk() {
      deleteUser(ids).then((res) => {
        if (res.code === 0) {
          refreshFunc();
        }
      })
      message.success('删除成功');
    }
  });
}

const contentModel = reactive({
  show: false,
  content: '',
});


async function updateIsCheckFunc(id, isChecked, record) {
  record.isCheckloading = true;
  await isSuperAdmin({ id, isChecked }).then((res) => {
    if (res.code === 0) {
      message.success('操作成功');
    } else {
      message.error(res.msg)
    }
  })
  refreshFunc();
  record.isCheckloading = false;
}
</script>

<template>
  <div class="text_show">
    <div class="actions">
      <a-breadcrumb>
        <a-breadcrumb-item>网站管理</a-breadcrumb-item>
        <a-breadcrumb-item>树洞管理</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <layoutTop :form-state="formData" @update:refresh-func="refreshFunc" @update:on-finish="onFinish">
      <template #form-items>
        <a-form-item label="用户名称" name="userName" style="margin-right: 1rem">
          <a-input v-model:value="formData.userName" placeholder="输入用户名称" style="width: 15em" />
        </a-form-item>
      </template>
      <template #operate-btn>
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
            </span><span style="margin-left: 0.2rem">查看内容</span>
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
        <a-table :columns="columns" :data-source="usersData" :loading="loading"
                 :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
                 :row-key="record => record.id" size="small">
          <template #bodyCell="{ column, record }">
            <!-- 头像渲染 -->
            <template v-if="column.dataIndex === 'avatar'">
              <img :src="record.avatar || 'https://img.ixintu.com/download/jpg/20200910/f9256155491e54bf5e99bf29eece0156_512_512.jpg!ys'"
                   style="width: 40px; height: 40px; border-radius: 50%; display: flex; justify-content: center;" />
            </template>

            <template v-if="column.dataIndex === 'email'">
              <a-tooltip v-if="record.email" placement="top">
                <template #title>
                  <span>{{ record.email }}</span>
                </template>
                {{ record.email.length > 15 ? record.email.slice(0, 15) + '...' : record.email }}
              </a-tooltip>
              <span v-else>暂无邮箱</span>
            </template>

            <template v-if="column.dataIndex === 'provider'">
              <span>{{ record.provider || '账号登录' }}</span>
            </template>


            <!-- 管理员权限开关 -->
            <template v-if="column.dataIndex === 'isAdmin'">
              <a-switch v-model:checked="record.isChecked" checked-children="是" un-checked-children="否"
                        @change="updateIsCheckFunc(record.id, record.isChecked, record)" />
            </template>

            <!-- 操作列 -->
            <template v-if="column.dataIndex === 'operation'">
              <a-popconfirm title="是否确定删除" ok-text="Yes" cancel-text="No" @confirm="onDelete([record.id])">
                <a-button type="link" style="padding: 0">
                  <template #icon>
                    <DeleteOutlined />
                  </template>
                  <span style="margin-left: 3px">删除</span>
                </a-button>
              </a-popconfirm>
            </template>
          </template>
        </a-table>
      </template>
    </layoutTop>
  </div>
</template>

<style scoped>
.text_show {
  background: white;
  min-height: 50vh;
  margin-bottom: 5rem;

  .actions {
    padding: 1rem;

    h1 {
      margin-top: 1rem;
      font-size: 1.2rem;
      font-weight: 500;
    }
  }
}

:deep(.ant-select-arrow) {
  padding-top: 0.8rem;
}

:deep(.ant-picker-suffix) {
  padding-top: 0.45rem;
}
</style>
