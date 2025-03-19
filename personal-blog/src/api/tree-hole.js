import request from '../utils/request'

// 树洞列表
export const treeHoleList = () => request.get('/tree-hole')

// 创建树洞
export const createTreeHole = (data) => request.post('/tree-hole/create', data)
