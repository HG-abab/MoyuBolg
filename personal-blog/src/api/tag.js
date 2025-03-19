import request from '../utils/request'

// 获取标签列表
export const getTagList = () => request.get('/tag')
