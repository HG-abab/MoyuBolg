import request from '../utils/request'

// 获取相册列表
export const getPhotoList = (data) => request.post('/photo/back/list', data)

// 创建
export const createPhoto = (data) => request.post('/photo/album/create', data)

// 修改
export const updatePhoto = (data) => request.put('/photo/album/update', data)

// 删除
export const deletePhoto = (data) => request.delete('/photo/album/delete', data)

// 上传
export const uploadPhoto = (data) => request.post('/upload', data)
