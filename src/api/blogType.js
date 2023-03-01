import request from '@/utils/request'

/**
 * 获取文章分类
 * @returns 
 */
export function getBlogType() {
  // return request({
  //   url: '/api/blogtype',
  //   method: 'get',
  // })

  return request.get('/api/blogtype');
}

/**
 * 添加文章分类
 * @returns 
 */
export function addBlogType(data) {
  return request({
    url: '/api/blogtype',
    method: 'post',
    data
  })
}

/**
 * 删除文章分类
 * @returns 
 */
export function delBlogType(id) {
  return request({
    url: `/api/blogtype/${id}`,
    method: 'delete',
  })
}

/**
 * 查询
 * @returns 
 */
export function findOneBlogType(id) {
  return request({
    url: `/api/blogtype/${id}`,
    method: 'get',
  })
}

/**
 * 修改文章分类
 * @returns 
 */
export function updateOneBlogType(editInfo) {
  return request({
    url: `/api/blogtype/${editInfo.id}`,
    method: 'put',
    data: editInfo.data
  })
}