import request from '../utils/request'

// 分类数
export const getCategoriesCount = () => request.get('/category/count')
