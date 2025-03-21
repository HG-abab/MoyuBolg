
import request from '../utils/request'

// 账号登录
export const AccountLogin = (data) => request.post('/auth/signIn',data)