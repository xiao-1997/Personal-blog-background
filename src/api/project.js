import request from '@/utils/request'
//文章列表

/**
 * 获取所有项目
 * @returns 
 */
export function getProject() {
  return request({
    url: '/api/project',
    method: 'get',
  })
}

/**
 * 新增项目
 * @param {*} data 新增项目的信息
 * @returns 
 */
export function addProject(data) {
  return request({
    url: '/api/project',
    method: 'post',
    data,
  })
}

/**
 * 修改项目
 * @param {*} id 项目的id
 * @param {*} data 项目修改后的数据
 * @returns 
 */
export function setProject(id, data) {
  return request({
    url: `/api/project/${id}`,
    method: 'put',
    data,
  })
}

/**
 * 删除项目
 * @param {*} id 要删除的文章ID
 * @returns 
 */
export function delProject(id) {
  return request({
    url: `/api/project/${id}`,
    method: 'DELETE',
  })
}