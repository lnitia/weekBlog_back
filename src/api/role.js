import request from '@/utils/request'


export function editRole(roles,id) {
  return request({
    url: '/my/userroles',
    method: 'post',
    data:{roles,id}
  })
}



export function deleteRole(id) {
  return request({
    url: '/my/deleteuser',
    method: 'delete',
    params:{id}
  })
}
