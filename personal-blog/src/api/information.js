import request from '../utils/request'

// 获取背景图
export const getBackground = () => request.get('/information/getbgurl')

// 获取web信息
export const getWebInfo = () => request.get('/information/getstation')
