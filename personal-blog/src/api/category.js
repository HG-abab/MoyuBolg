import request from '../utils/request'

// 分类数
export const getcategoryList = () => request.get('/category/count')
