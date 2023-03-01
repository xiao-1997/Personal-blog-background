import { loginApi, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    user: null,//存储登陆用户的信息
  }
}

const state = getDefaultState()

const mutations = {

  //清空用户信息
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  // SET_TOKEN: (state, token) => {
  //   state.token = token
  // },
  // SET_NAME: (state, name) => {
  //   state.name = name
  // },
  // SET_AVATAR: (state, avatar) => {
  //   state.avatar = avatar
  // },

  SET_USER: (state, payload) => {
    state.user = payload
  },
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      loginApi(userInfo).then(res => {
        const { data } = res;
        if (data) {
          //说明里面有数据
          commit("SET_USER", data)
          resolve();
        } else {
          //只要有数据中有错误就执行
          reject(res)
        }
      }).catch(error => {
        //只要有数据中有错误就执行
        console.log(error);
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      //重新获取登陆状态
      //服务器设置，正确情况是对象，错误的字符串
      getInfo().then(res => {
        // console.log(res);
        if (typeof res === 'string') {

          // 验证成功的情况
          // {
          //   "code": 0,
          //   "msg": "",
          //   "data": {
          //     "loginId": "yjisme",
          //     "name": "管理员",
          //     "id": "608530d2dfce8783ab52a45d"
          //   }
          // }
          //  string 验证失败的请求
          // {"code":401,"msg":"未登录，或登录已过期","data":null}

          //token已过期
          // reject()
          res = JSON.parse(res);
          if (res.code === 401) {
            reject()
          }
        } else {
          //存储取到的用户信息
          commit("SET_USER", res.data);
          resolve();
        }
      })

      // getInfo(state.token).then(response => {
      //   const { data } = response

      //   if (!data) {
      //     return reject('Verification failed, please Login again.')
      //   }

      //   const { name, avatar } = data

      //   commit('SET_NAME', name)
      //   commit('SET_AVATAR', avatar)
      //   resolve(data)
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // 退出登录
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {

      removeToken();//删除本地信息
      resetRouter();//重置路由
      commit('RESET_STATE')//
      resolve()

      //在这个项目中，服务器没有退出登录信息
      // logout(state.token).then(() => {
      //   removeToken() // must remove  token  first
      //   resetRouter()
      //   commit('RESET_STATE')
      //   resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },


  //清空token
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() //删除token
      commit('RESET_STATE')//清空用户信息
      resolve()//结束进程
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

