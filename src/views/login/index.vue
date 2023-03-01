<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
      @keyup.enter.native="handleLogin"
    >
      <div class="title-container">
        <h3 class="title">个人空间管理系统</h3>
      </div>
      <!-- 账号登陆 -->
      <el-form-item prop="loginId">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="loginId"
          v-model="loginForm.loginId"
          placeholder="请输入管理员账号"
          name="loginId"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <!-- 密码 -->
      <el-form-item prop="loginPwd">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.loginPwd"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>

      <!-- 验证码 -->
      <div class="captchaContainer">
        <el-form-item prop="captcha" class="captchaInputer">
          <span class="svg-container">
            <svg-icon icon-class="nested" />
          </span>
          <el-input
            ref="captcha"
            v-model="loginForm.captcha"
            placeholder="请输入验证码"
            name="captcha"
            type="text"
            tabindex="3"
            auto-complete="on"
          />
        </el-form-item>
        <div class="captchaImg" @click="getCaptchaFunc" v-html="svg"></div>
      </div>

      <!-- 免登录 -->
      <div style="margin-bottom: 15px">
        <el-checkbox v-model="loginForm.checked">7天内免登录</el-checkbox>
      </div>

      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleLogin"
        >登陆</el-button
      >
    </el-form>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
import { getCaptcha } from "@/api/captcha";

export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error("Please enter the correct user name"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("The password can not be less than 6 digits"));
      } else {
        callback();
      }
    };
    return {
      svg: "",
      loginForm: {
        loginId: "", //账号
        loginPwd: "", //密码
        captcha: "", //验证码
        checked: true,
      },
      loginRules: {
        //表单验证规则
        //通过prop属性关联
        loginId: [
          {
            //是否必须填/什么时候触发/触发的时候显示的信息
            required: true,
            trigger: "blur",
            message: "请输入管理员账号",
          },
        ],
        loginPwd: [
          {
            //是否必须填/什么时候触发/触发的时候显示的信息
            required: true,
            trigger: "blur",
            message: "请输入管理员密码",
          },
        ],
        captcha: [
          {
            //是否必须填/什么时候触发/触发的时候显示的信息
            required: true,
            trigger: "blur",
            message: "请输入验证码",
          },
        ],
      },
      passwordType: "password", //密码类型
      loading: false,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
    this.getCaptchaFunc();
  },
  methods: {
    getCaptchaFunc() {
      getCaptcha().then((test) => {
        this.svg = test;
      });
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    //登陆方法
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          // 符合规定
          this.loading = true;

          if (this.loginForm.checked) {
            //如果勾选上7天免登陆，在提交的表单中增加一个属性
            this.loginForm.remember = 7;
          }

          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || "/" });
              this.loading = false;
            })
            .catch((res) => {
              // console.log(res);
              //进入说明提交失败，查看失败原因
              if (typeof res === "string") {
                //已经设定验证码失败返回string
                //检查验证码是否正常由服务器负责
                this.$message.error("验证码错误");
              } else {
                //已经设定验证码失败返回object
                this.$message.error("账号密码错误");
              }
              //提示失败原因重新刷新验证码
              this.getCaptchaFunc();
              this.loading = false; //是否在加载中
              this.loginForm.captcha = ""; //提交的验证码设置为空
            });
        } else {
          //某一项或者全部不符合规定
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .captchaContainer {
    display: flex;
  }

  .captchaInputer {
    width: 70%;
  }
  .captchaImg {
    width: 150px;
    height: 50px;
  }
}
</style>
