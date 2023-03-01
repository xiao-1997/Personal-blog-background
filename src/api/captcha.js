//发送请求获取新的验证码

import request from '@/utils/request'

//验证码接口
// /res/captcha

export function getCaptcha(params) {
    return request({
        url: '/res/captcha',
        method: 'get'
    })
}
