// 文章管理
import request from '../utils/request'

//获取文章
export const getArticle = (id) => request.get(`/article/${id}`)

// 添加文章
export const addArticle = (data) => request.post('/article/addActicle', data)

// 上传图片
export const uploadImg = (data) =>
  request.post('/upload', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

// 删除
export const deleteArticle = (id) => request.delete(`/article/deleteArticle/${id}`)

// 更新文章状态
export const updateArticleStatus = (data) => request.put('/article/updateArticle', data)

// 更新置顶状态
export const updateTopStatus = (data) => request.put('/article/updateArticleTop', data)

// 搜索
export const searchArticle = (data) => request.post('/article/search', data)

// 分类id获取
export const getByCateId = (id) => request.get(`/category/${id}`)
