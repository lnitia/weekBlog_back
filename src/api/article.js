import request from '@/utils/request'

export function getPostsByWeek(time) {
  return request({
    url: '/my/article/listbytime',
    method: 'get',
    params: { time }
  })
}
export function fetchArticle(uid) {
  return request({
    url: '/my/article/listbyuid',
    method: 'get',
    params: { uid }
  })
}
export function getMarkdownArticleByAid(id) {
  return request({
    url: 'my/article/info',
    method: 'get',
    params: { id }
  })
}
export function createMarkdownArticle(data) {
  return request({
    url:  '/my/article/add',
    method: 'post',
    data
  })
}
export function saveMarkdownArticle(data) {
  return request({
    url:  '/my/article/update',
    method: 'post',
    data
  })
}
export function uploadImg(data) {
  return request({
    url: '/my/article/uploadpic',
    method: 'post',
    data 
    // headers:{'Content-Type':"application/x-www-form-urlencoded"}

  })
}
export function delArticle(id) {
  return request({
    url: '/my/article/delete',
    method: 'delete',
    params: { id }
  })
}

