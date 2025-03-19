// 树洞管理
import request from '../utils/request'

// 获取
export const getTreeHoleList = (id) => request.get(`/tree-hole/${id}`)

// 是否通过
export const updateTreeHole = (data) => request.put('/tree-hole/isCheck', data)

// 删除
export const deleteTreeHole = (id) => request.delete(`/tree-hole/delete/${id}`)

// 搜索
export const searchTreeHole = (data) => request.post('/tree-hole/search', data)
