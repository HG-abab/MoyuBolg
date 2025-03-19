import request from '../utils/request'
// 置顶文章
export const getTopArticle = () => request.get('/article/getTopArticle')

// 所有文章
export const getAllArticle = (id) => request.get(`/article/${id}`)

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
