import request from '../utils/request'
// 置顶文章
// 导出一个函数，用于获取置顶文章
export const getTopArticle = () => request.get('/article/getTopArticle')

// 所有文章
export const getAllArticle = (id) => request.get(`/article/${id}`)

// 作者文章
export const getuserNameArticle = (id) => request.get(`/article/userName/${id}`)

// 获取上下文章title
export const getAroundTitle = (id) => request.get(`/article/articleTitle/${id}`)

// 点赞
export const isLike = (data) => request.put(`/article/likeArticle`, data)

// 收藏
export const isCollect = (data) => request.put(`/article/collectArticle`, data)

// 获取该用户当前该文章是否点赞
export const getIsLike = (data) => request.post(`/article/isLikeArticle`, data)

// 获取该用户当前该文章是否收藏
export const getIsCollect = (data) => request.post(`/article/isCollectArticle`, data)

// 分类文章
export const getArticleByCategory = () => request.get(`/article/category`)

// 标签文章
export const getArticleByTag = () => request.get(`/article/tag`)

// 搜索文章标题 内容
export const getArticleBySearch = (data) => request.post(`/article/searchTitle`, data)

//获取搜索记录
export const getSearchHistory = (data) => request.post(`/article/search`, data)

// 删除搜索记录
export const deleteSearchHistory = (data) => request.delete(`/article/deleteSearchRecord`, {data})

// 获取文章列表
export function getArticleList(params) {
  return request({
    url: '/article/list',
    method: 'get',
    params
  })
}

// 获取文章详情
export function getArticle(id) {
  return request({
    url: `/article/${id}`,
    method: 'get'
  })
}

// 创建文章
export function createArticle(data) {
  return request({
    url: '/article',
    method: 'post',
    data
  })
}

// 更新文章
export function updateArticle(id, data) {
  return request({
    url: `/article/${id}`,
    method: 'put',
    data
  })
}

// 删除文章
export function deleteArticle(id) {
  return request({
    url: `/article/${id}`,
    method: 'delete'
  })
}

// 添加文章
export const addArticle = (data) => request.post('/article/addActicle', data)
