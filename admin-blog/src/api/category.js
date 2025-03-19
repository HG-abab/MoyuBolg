// 标签管理
import request from '../utils/request'

// 获取标签列表
export const getcategoryList = () => request.get('/category')

// 添加标签
export const addcategory = (data) => request.post('/category/createcategory', data)

// 删除标签
export const deletecategoryList = (id) => request.delete(`/category/deletecategory/${id}`)

// 修改标签
export const updatecategory = (data) => request.put('/category/updatecategory', data)

// 查询
export const searchcategory = (data) => request.post('/category/search', data)
