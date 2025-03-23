import request from '../utils/request'

// 获取用户列表
export const getUserList = () => request.get('/users')


// 是否是管理员
export const isSuperAdmin = (data) => request.put(`/users/update/isAdmin`, data)

// 通过id查询用户
export const getUserById = (id) => request.get(`/users/${id}`)

// 删除
export const deleteUser = (id) => request.delete(`/users/${id}`)