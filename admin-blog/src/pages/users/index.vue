<template>
  <div class="users-management">
    <div class="page-header">
      <div class="page-title">
        <a-space>
          <TeamOutlined />
          <h1>用户权限管理</h1>
        </a-space>
        <span class="subtitle">设置系统用户账号和权限</span>
      </div>
      <div class="header-actions">
        <a-button type="primary" @click="showAddUserModal">
          <template #icon>
            <UserAddOutlined />
          </template>
          添加用户
        </a-button>
      </div>
    </div>

    <a-card :bordered="false" class="content-card">
      <a-space direction="vertical" :size="16" style="width: 100%">
        <!-- 搜索过滤区域 -->
        <div class="filter-container">
          <a-input-search v-model:value="searchQuery" placeholder="搜索用户名/昵称" style="max-width: 300px;"
                          @search="onSearch" allowClear />
          <a-select v-model:value="roleFilter" style="width: 120px;" placeholder="角色" allowClear @change="onSearch">
            <a-select-option value="admin">管理员</a-select-option>
            <a-select-option value="editor">编辑</a-select-option>
            <a-select-option value="visitor">访客</a-select-option>
          </a-select>
          <a-select v-model:value="statusFilter" style="width: 120px;" placeholder="状态" allowClear @change="onSearch">
            <a-select-option :value="true">启用</a-select-option>
            <a-select-option :value="false">禁用</a-select-option>
          </a-select>
        </div>

        <!-- 表格区域 -->
        <a-table :dataSource="filteredUsers" :columns="columns" :loading="loading" :pagination="{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`
        }" rowKey="id" :scroll="{ x: 'max-content' }">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'role'">
              <a-tag :color="roleColors[record.role] || 'default'">
                {{ roleLabels[record.role] || record.role }}
              </a-tag>
            </template>

            <template v-if="column.key === 'status'">
              <a-badge :status="record.status ? 'success' : 'error'" />
              <span>{{ record.status ? '启用' : '禁用' }}</span>
            </template>

            <template v-if="column.key === 'actions'">
              <a-space>
                <a-tooltip title="编辑用户">
                  <a-button type="link" size="small" @click="editUser(record)">
                    <template #icon>
                      <EditOutlined />
                    </template>
                  </a-button>
                </a-tooltip>
                <a-tooltip title="设置权限">
                  <a-button type="link" size="small" @click="editPermissions(record)">
                    <template #icon>
                      <SafetyCertificateOutlined />
                    </template>
                  </a-button>
                </a-tooltip>
                <a-tooltip title="删除用户">
                  <a-button type="link" size="small" danger @click="deleteUser(record)" v-if="record.role !== 'admin'">
                    <template #icon>
                      <DeleteOutlined />
                    </template>
                  </a-button>
                </a-tooltip>
              </a-space>
            </template>
          </template>
        </a-table>
      </a-space>
    </a-card>

    <!-- 添加/编辑用户弹窗 -->
    <a-modal v-model:visible="userModalVisible" :title="isEdit ? '编辑用户' : '添加用户'" @ok="handleUserSubmit"
             @cancel="userModalVisible = false" :confirmLoading="userSubmitLoading" :maskClosable="false"
             :width="isMobile ? '95%' : '600px'">
      <a-form :model="userForm" :label-col="isMobile ? { span: 24 } : { span: 6 }"
              :wrapper-col="isMobile ? { span: 24 } : { span: 16 }" layout="horizontal">
        <a-form-item label="用户名" required>
          <a-input v-model:value="userForm.username" :disabled="isEdit" />
        </a-form-item>
        <a-form-item label="昵称">
          <a-input v-model:value="userForm.nickname" />
        </a-form-item>
        <a-form-item :label="isEdit ? '修改密码' : '密码'" :required="!isEdit">
          <a-input-password v-model:value="userForm.password" :placeholder="isEdit ? '不修改请留空' : '请输入密码'" />
        </a-form-item>
        <a-form-item label="角色">
          <a-select v-model:value="userForm.role">
            <a-select-option value="admin">管理员</a-select-option>
            <a-select-option value="editor">编辑</a-select-option>
            <a-select-option value="visitor">访客</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="状态">
          <a-switch v-model:checked="userForm.status" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 权限设置弹窗 -->
    <a-modal v-model:visible="permissionModalVisible" title="设置权限" @ok="handlePermissionSubmit"
             @cancel="permissionModalVisible = false" :confirmLoading="permissionSubmitLoading"
             :width="isMobile ? '95%' : '750px'" :maskClosable="false">
      <div class="permission-title">
        为用户 <b>{{ userForm.username }}</b> 设置权限:
      </div>

      <a-collapse accordion class="permission-collapse">
        <a-collapse-panel key="1" header="文章管理权限" :forceRender="true">
          <a-checkbox-group v-model:value="userForm.permissions.articles">
            <div class="permission-grid">
              <a-checkbox value="read:articles">浏览文章</a-checkbox>
              <a-checkbox value="write:articles">发布文章</a-checkbox>
              <a-checkbox value="edit:articles">编辑文章</a-checkbox>
              <a-checkbox value="delete:articles">删除文章</a-checkbox>
            </div>
          </a-checkbox-group>
        </a-collapse-panel>

        <a-collapse-panel key="2" header="用户管理权限" :forceRender="true">
          <a-checkbox-group v-model:value="userForm.permissions.users">
            <div class="permission-grid">
              <a-checkbox value="read:users">查看用户</a-checkbox>
              <a-checkbox value="create:users">创建用户</a-checkbox>
              <a-checkbox value="edit:users">编辑用户</a-checkbox>
              <a-checkbox value="delete:users">删除用户</a-checkbox>
            </div>
          </a-checkbox-group>
        </a-collapse-panel>

        <a-collapse-panel key="3" header="评论管理权限" :forceRender="true">
          <a-checkbox-group v-model:value="userForm.permissions.comments">
            <div class="permission-grid">
              <a-checkbox value="read:comments">查看评论</a-checkbox>
              <a-checkbox value="approve:comments">审核评论</a-checkbox>
              <a-checkbox value="edit:comments">编辑评论</a-checkbox>
              <a-checkbox value="delete:comments">删除评论</a-checkbox>
            </div>
          </a-checkbox-group>
        </a-collapse-panel>

        <a-collapse-panel key="4" header="内容分类权限" :forceRender="true">
          <a-checkbox-group v-model:value="userForm.permissions.categories">
            <div class="permission-grid">
              <a-checkbox value="read:categories">查看分类</a-checkbox>
              <a-checkbox value="create:categories">创建分类</a-checkbox>
              <a-checkbox value="edit:categories">编辑分类</a-checkbox>
              <a-checkbox value="delete:categories">删除分类</a-checkbox>
            </div>
          </a-checkbox-group>
        </a-collapse-panel>

        <a-collapse-panel key="5" header="系统管理权限" :forceRender="true">
          <a-checkbox-group v-model:value="userForm.permissions.system">
            <div class="permission-grid">
              <a-checkbox value="view:dashboard">查看仪表盘</a-checkbox>
              <a-checkbox value="edit:settings">修改设置</a-checkbox>
              <a-checkbox value="manage:backup">管理备份</a-checkbox>
              <a-checkbox value="view:logs">查看日志</a-checkbox>
            </div>
          </a-checkbox-group>
        </a-collapse-panel>
      </a-collapse>

      <div class="permission-actions">
        <a-space>
          <a-button @click="selectAllPermissions">全选</a-button>
          <a-button @click="clearAllPermissions">清空</a-button>
        </a-space>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import {
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  SafetyCertificateOutlined,
  TeamOutlined
} from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import { createUser, updateUser, deleteUser, getUserList } from '@/api/user'

// 响应式状态
const isMobile = ref(window.innerWidth < 768)
const loading = ref(false)
const users = ref([])
const userModalVisible = ref(false)
const permissionModalVisible = ref(false)
const userSubmitLoading = ref(false)
const permissionSubmitLoading = ref(false)
const isEdit = ref(false)
const searchQuery = ref('')
const roleFilter = ref(undefined)
const statusFilter = ref(undefined)

// 角色标签配置
const roleLabels = {
  admin: '管理员',
  editor: '编辑',
  visitor: '访客'
}

const roleColors = {
  admin: 'red',
  editor: 'blue',
  visitor: 'green'
}

// 表格列定义
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80
  },
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    key: 'nickname',
  },
  {
    title: '角色',
    dataIndex: 'role',
    key: 'role',
    width: 100,
    filters: [
      { text: '管理员', value: 'admin' },
      { text: '编辑', value: 'editor' },
      { text: '访客', value: 'visitor' },
    ],
    onFilter: (value, record) => record.role === value,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    filters: [
      { text: '启用', value: true },
      { text: '禁用', value: false },
    ],
    onFilter: (value, record) => record.status === value,
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  },
  {
    title: '操作',
    key: 'actions',
    fixed: 'right',
    width: 150,
  }
]

// 用户表单数据
const userForm = reactive({
  id: null,
  username: '',
  nickname: '',
  password: '',
  role: 'editor',
  status: true,
  permissions: {
    articles: [],
    users: [],
    comments: [],
    categories: [],
    system: []
  }
})

// 过滤后的用户列表
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    // 搜索过滤
    if (searchQuery.value &&
      !user.username.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
      !user.nickname.toLowerCase().includes(searchQuery.value.toLowerCase())) {
      return false
    }

    // 角色过滤
    if (roleFilter.value !== undefined && user.role !== roleFilter.value) {
      return false
    }

    // 状态过滤
    if (statusFilter.value !== undefined && user.status !== statusFilter.value) {
      return false
    }

    return true
  })
})

// 重置用户表单
const resetUserForm = () => {
  userForm.id = null
  userForm.username = ''
  userForm.nickname = ''
  userForm.password = ''
  userForm.role = 'editor'
  userForm.status = true
  userForm.permissions = {
    articles: [],
    users: [],
    comments: [],
    categories: [],
    system: []
  }
}

// 加载用户数据
const loadUsers = async () => {
  loading.value = true
  try {
    // 模拟API调用
    // const res = await getUserList()
    // users.value = res.data

    // 模拟数据
    users.value = [
      {
        id: 1,
        username: 'admin',
        nickname: '超级管理员',
        role: 'admin',
        status: true,
        createdAt: '2023-01-01 12:00:00',
        permissions: {
          articles: ['read:articles', 'write:articles', 'edit:articles', 'delete:articles'],
          users: ['read:users', 'edit:users'],
          comments: ['read:comments', 'edit:comments', 'delete:comments'],
          categories: ['read:categories', 'create:categories', 'edit:categories'],
          system: ['view:dashboard', 'edit:settings', 'view:logs']
        }
      },
      {
        id: 2,
        username: 'editor',
        nickname: '内容编辑',
        role: 'editor',
        status: true,
        createdAt: '2023-02-15 10:30:00',
        permissions: {
          articles: ['read:articles', 'write:articles'],
          users: [],
          comments: ['read:comments'],
          categories: ['read:categories'],
          system: ['view:dashboard']
        }
      },
      {
        id: 3,
        username: 'visitor',
        nickname: '访客用户',
        role: 'visitor',
        status: false,
        createdAt: '2023-03-20 15:45:00',
        permissions: {
          articles: ['read:articles'],
          users: [],
          comments: ['read:comments'],
          categories: ['read:categories'],
          system: []
        }
      }
    ]
  } finally {
    loading.value = false
  }
}

// 搜索处理函数
const onSearch = () => {
  // 已通过计算属性处理过滤逻辑
}

// 显示添加用户弹窗
const showAddUserModal = () => {
  isEdit.value = false
  resetUserForm()
  userModalVisible.value = true
}

// 编辑用户
const editUser = (user) => {
  isEdit.value = true
  resetUserForm()
  Object.assign(userForm, user)
  userModalVisible.value = true
}

// 编辑用户权限
const editPermissions = (user) => {
  resetUserForm()
  Object.assign(userForm, user)
  permissionModalVisible.value = true
}

// 删除用户
const deleteUser = (user) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除用户 "${user.username}" 吗？此操作不可恢复。`,
    okText: '确认',
    okType: 'danger',
    cancelText: '取消',
    async onOk() {
      try {
        loading.value = true
        // 在实际应用中调用API
        // await deleteUserAPI(user.id)

        // 模拟删除
        users.value = users.value.filter(item => item.id !== user.id)
        message.success('删除用户成功')
      } catch (error) {
        message.error('删除用户失败: ' + error.message)
      } finally {
        loading.value = false
      }
    }
  })
}

// 处理用户表单提交
const handleUserSubmit = async () => {
  // 表单验证
  if (!userForm.username) {
    message.error('用户名不能为空')
    return
  }

  if (!isEdit.value && !userForm.password) {
    message.error('密码不能为空')
    return
  }

  userSubmitLoading.value = true

  try {
    // 构建API请求数据
    const userData = {
      username: userForm.username,
      nickname: userForm.nickname,
      role: userForm.role,
      status: userForm.status,
      permissions: userForm.permissions
    }

    if (userForm.password) {
      userData.password = userForm.password
    }

    if (isEdit.value) {
      // 模拟编辑用户
      // await updateUser(userForm.id, userData)

      // 模拟更新本地数据
      setTimeout(() => {
        const index = users.value.findIndex(u => u.id === userForm.id)
        if (index !== -1) {
          users.value[index] = {
            ...users.value[index],
            ...userData,
            password: undefined
          }
        }
        message.success('用户更新成功')
        userModalVisible.value = false
      }, 500)
    } else {
      // 模拟添加用户
      // await createUser(userData)

      // 模拟添加到本地数据
      setTimeout(() => {
        const newUser = {
          id: Date.now(),
          ...userData,
          createdAt: new Date().toLocaleString(),
          password: undefined
        }
        users.value.push(newUser)
        message.success('用户添加成功')
        userModalVisible.value = false
      }, 500)
    }
  } catch (error) {
    message.error(isEdit.value ? '更新用户失败' : '添加用户失败')
  } finally {
    userSubmitLoading.value = false
  }
}

// 处理权限表单提交
const handlePermissionSubmit = async () => {
  permissionSubmitLoading.value = true

  try {
    // 模拟更新权限
    setTimeout(() => {
      const index = users.value.findIndex(u => u.id === userForm.id)
      if (index !== -1) {
        users.value[index].permissions = { ...userForm.permissions }
      }
      message.success('权限设置成功')
      permissionModalVisible.value = false
    }, 500)
  } catch (error) {
    message.error('权限设置失败')
  } finally {
    permissionSubmitLoading.value = false
  }
}

// 权限辅助功能
const selectAllPermissions = () => {
  userForm.permissions = {
    articles: ['read:articles', 'write:articles', 'edit:articles', 'delete:articles'],
    users: ['read:users', 'create:users', 'edit:users', 'delete:users'],
    comments: ['read:comments', 'approve:comments', 'edit:comments', 'delete:comments'],
    categories: ['read:categories', 'create:categories', 'edit:categories', 'delete:categories'],
    system: ['view:dashboard', 'edit:settings', 'manage:backup', 'view:logs']
  }
}

const clearAllPermissions = () => {
  userForm.permissions = {
    articles: [],
    users: [],
    comments: [],
    categories: [],
    system: []
  }
}

// 窗口大小变化监听
const handleResize = () => {
  isMobile.value = window.innerWidth < 768
}

// 初始加载
onMounted(() => {
  loadUsers()
  window.addEventListener('resize', handleResize)
})
</script>

<style lang="scss" scoped>
.users-management {
  padding: 16px;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 16px;

    .page-title {
      h1 {
        font-size: 18px;
        font-weight: 600;
        margin: 0;
        color: rgba(0, 0, 0, 0.85);
      }

      .subtitle {
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
        display: block;
        margin-top: 4px;
      }
    }
  }

  .content-card {
    margin-bottom: 24px;
    border-radius: 8px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
  }

  .filter-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 8px;
  }

  .permission-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;

    :deep(.ant-checkbox-wrapper) {
      margin-right: 8px;
    }
  }

  .permission-collapse {
    margin: 16px 0;
  }

  .permission-title {
    margin-bottom: 16px;
    font-size: 14px;
  }

  .permission-actions {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }
}

/* 自适应调整 */
@media (max-width: 768px) {
  .users-management {
    padding: 12px;

    .page-header {
      flex-direction: column;
      align-items: flex-start;

      .header-actions {
        width: 100%;
        margin-top: 12px;
      }
    }

    .filter-container {
      flex-direction: column;
      align-items: flex-start;

      .ant-input-search {
        width: 100%;
        max-width: 100%;
      }

      .ant-select {
        width: 100% !important;
      }
    }

    .permission-grid {
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    }
  }
}

/* 暗色模式适配 */
:deep(.dark) {
  .users-management {
    .page-header .page-title h1 {
      color: rgba(255, 255, 255, 0.85);
    }

    .page-header .page-title .subtitle {
      color: rgba(255, 255, 255, 0.45);
    }
  }
}
</style>