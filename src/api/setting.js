//设置
import request from '@/utils/request'

// 获取设置内容
export async function getSetting() {
  return await request.get("/api/setting");
}

// 上传设置内容
export function setSetting(data) {
  return request({
    url: '/api/setting',
    method: 'put',
    data
  })
}
