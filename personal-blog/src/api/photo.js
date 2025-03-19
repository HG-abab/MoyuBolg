import request from '../utils/request'

// 获取相册列表
export const getPhotoList = (data) => request.post('/photo/back/list', data)

// 文件夹id 返回文件夹下第一个照片的url 没有返回空
export const getPhotoUrl = (id) => request.get(`/photo/album/firstPhoto/${id}`)
