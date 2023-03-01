import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

//路径，白名单，不需要权限的页面
const whiteList = ['/login'] // no redirect whitelist

//导航守卫
router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  //拿到token
  // determine whether the user has logged in
  // const hasToken = getToken()

  //获取本地用户信息
  const hasGetUserInfo = store.getters.user;

  if (to.meta.auth) {
    //说明去的页面需要权限
    // console.log(hasGetUserInfo)
    if (hasGetUserInfo) {
      //本地有用户信息,直接放行
      next()
    } else {
      //检查是否有token
      const hasToken = localStorage.getItem("adminToken");
      if (hasToken) {
        //有token，检查有效期
        try {
          //相当于whoami，检查是否登陆记录
          await store.dispatch("user/getInfo")
          next();
        } catch (error) {
          //如果返回的是token无效会转到这里

          await store.dispatch("user/resetToken")
          //登陆完成后，跳转至要去的页面
          Message.error("登陆过期，请重新登陆");//弹窗
          next(`/login?redirect=${to.path}`)
          NProgress.done();//进度条结束
        }
      } else {
        //没有token
        //登陆完成后，跳转至要去的页面
        next(`/login?redirect=${to.path}`)

        NProgress.done();//进度条结束
      }
    }
  } else {
    //去的页面不需要权限
    if (to.path === "/login" && hasGetUserInfo) {
      //说明登陆过，并且去的是登陆页面
      next({ path: '/' })
    } else {
      //没有登陆过，直接放行
      next();
    }
    //进度条结束
    NProgress.done();
  }








  //原本的流程
  //判断是否由token
  // if (hasToken) {
  //   if (to.path === '/login') {
  //     //有token的情况下去的是登陆页面，放行并转向首页
  //     // if is logged in, redirect to the home page
  //     next({ path: '/' })
  //     NProgress.done()
  //   } else {
  //     // 进的不是 login,看一下是否有用户信息
  //     const hasGetUserInfo = store.getters.name
  //     if (hasGetUserInfo) {
  //       //有用户信息直接放行
  //       next()
  //     } else {
  //       // 说明没有用户信息，但是你又有 token，
  //       //接下来就使用你 localStorage 里面的 token 去服务器拿用户信息
  //       try {
  //         // get user info
  //         //获取成功，放行
  //         await store.dispatch('user/getInfo')

  //         next()
  //       } catch (error) {
  //         //进入说明token有问题，把token清除，重新导向登陆页面
  //         // remove token and go to login page to re-login
  //         await store.dispatch('user/resetToken')
  //         Message.error(error || 'Has Error')
  //         next(`/login?redirect=${to.path}`)
  //         NProgress.done()
  //       }
  //     }
  //   }
  // } else {
  //   /* has no token*/
  //   //没有token
  //   if (whiteList.indexOf(to.path) !== -1) {
  //     //判断进入的页面是否在白名单
  //     // in the free login whitelist, go directly
  //     next()
  //   } else {
  //     // other pages that do not have permission to access are redirected to the login page.
  //     next(`/login?redirect=${to.path}`)
  //     NProgress.done()
  //   }
  // }
})


router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
