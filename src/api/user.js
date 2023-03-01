import request from '@/utils/request'

//登陆
export function loginApi(data) {
  return request({
    url: '/api/admin/login',
    method: 'post',//需要提交数据
    data//带过去的数据
  })
}

//恢复登陆
export function getInfo() {
  return request({
    url: '/api/admin/whoami',
    method: 'get',
  })
}

//退出登录
export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

// 修改用户
export function setUser(data) {
  return request({
    url: '/api/admin',
    method: 'PUT',
    data
  })
}