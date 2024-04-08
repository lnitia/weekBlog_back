import request from '@/utils/request'

export function login(password, username) {
  return request({
    url: '/api/login',
    method: 'post',
    data: { password, username }
  })
}

export function register(data) {
  return request({
    url: '/api/reguser',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/article/selectAllUser',
    method: 'get'

  })
}
export function getSession() {
  return request({
    url: '/getSessionId',
    method: 'get'

  })
}
export function getUsers() {
  return request({
    url: '/my/userall',
    method: 'get'

  })
}
export function updateInfo(name,email) {
  console.log(name,email)
  return request({
    url: '/my/userinfo',
    method: 'post',
    data:{username:name,email}
  })
}

