import request from '@/utils/request'

/**
 * 获取当前页评论
 * @param {*} page 当前页
 * @param {*} limit 页容量
 * @returns 
 */
export function getComment(page = 1, limit = 10) {
  return request({
    url: '/api/comment',
    method: 'GET',
    params: {
      page,
      limit
    }
  })
}

/**
 * 删除评论
 * @returns 
 */
export function delComment(id) {
  return request.delete(`/api/comment/${id}`);
}