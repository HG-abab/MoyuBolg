import request from '../utils/request'

// 获取留言列表
export const getMessageList = (id) => request.get(`/message/${id}`)

// 更新审核状态
export const updateStatus = (data) => request.put(`/message/updateIsCheck`, data)

// 删除留言
export const deleteMessage = (id) => request.delete(`/message/delete/${id}`)

// 搜索
export const searchMessage = (data) => request.post(`/message/search`, data)
