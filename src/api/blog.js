import request from '@/utils/request';

/**
 * 获取分页文章数据
 * @param {*} page 获取那一页
 * @param {*} limit 页容量
 * @returns 
 */
export function findBlog(page = 1, limit = 10) {
  return request({
    url: '/api/blog',
    method: 'get',
    params: {
      page,
      limit
    }
  })
}

/**
 * 删除文章
 * @param {*} id 当前文章的id
 * @returns 
 */
export function delOneBlog(id) {
  return request({
    url: `/api/blog/:${id}`,
    method: 'delete',
  })
}

/**
 * 添加文章
 * @param {*} data 文章的信息 
 */
export function addBlog(data) {
  return request({
    url: '/api/blog',
    method: 'post',
    data,
  })
}

/**
 * 修改文章
 * @param {*} bligInfo 修改后的文章信息
 * @returns 
 */
export function editBlog(bligInfo) {
  return request({
    url: `/api/blog/${bligInfo.id}`,
    method: 'put',
    data: bligInfo.data
  })
}

/**
 * 编辑文章的信息
 * @param {*} id 要编辑的文章ID
 * @returns 
 */
export function findOneBlog(id) {
  return request({
    url: `/api/blog/${id}`,
    method: 'get',
  })
}