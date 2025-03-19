// 信息管理api
import request from '../utils/request'

// 保存站长信息
export const saveWebSiteInfo = (data) => request.post('/information/stationmaster', data)

// 获取站长信息
export const getWebSiteInfo = () => request.get('/information/getstation')

// 上传图片到后端处理
export const uploadImg = (data) =>
  request.post('/upload', data, {
    headers: {
      'Content-Type': 'multipart/form-data', // 确保上传文件时设置了正确的Content-Type
    },
  })

// 获取全部背景图
export const getAllBackground = () => request.get('/information/getbgurl')

// 上传背景图
export const uploadBackground = (data) => request.post('/information/updatebgurl', data)

// 删除背景图
export const deleteBackground = (id) => request.delete(`/information/deletebgurl/${id}`)

// 更新排序

export const updateSort = (data) => request.put('/information/sort', data)
