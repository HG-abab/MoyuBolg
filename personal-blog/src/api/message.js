import request from '../utils/request'

// 获取
export const getMessageList = (id) => request.get(`/message/${id}`)

// 创建
export const createMessage = (data) => request.post('/message/create', data)

// 点赞
export const likeMessage = (data) => request.put(`/message/likeArticle`, data)

// 收藏
export const collectMessage = (data) => request.put(`/message/collectArticle`, data)

// 用户是否点赞
export const isLikeMessage = (data) => request.post(`/message/isLikeArticle`, data)

// 用户是否收藏
export const isCollectMessage = (data) => request.post(`/message/isCollectArticle`, data)
