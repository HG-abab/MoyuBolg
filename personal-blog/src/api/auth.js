import request from '../utils/request'

// 注册
export const register = (data) => request.post('/auth/signUp', data)

// 登录

export const login = (data) => request.post('/auth/signIn', data)

//邮件重置密码
export const resetPassword = (data) => request.post('/auth/send-reset', data)

// 重置密码
export const resetPasswordByToken = (data) => {
  const { token, newPassword } = data;
  const url = `/auth/reset-password?token=${token}`;
  return request.post(url, { newPassword });
}