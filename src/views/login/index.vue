<template>
  <div class="login-container">
     <div class="title-container">
       <div class="title">登陆界面</div>
      </div>
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
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
      <div class="item">
            <label>记住密码</label>
            <input type="checkbox" v-model="loginForm.checked">
        </div>


      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleLogin"
        >登录</el-button
      >

     <div style="position: relative">
        <div class="tips">
          <span>Username : Please enter true name</span>
        </div>
        <div class="tips">
          <span style="margin-right: 18px">Password : Please enter 6 digits at least</span>
        </div>
    <el-button class="toRegister-button" type="primary" @click="toRegister">
          注册
        </el-button>

      </div>
    </el-form>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
import { login, getSession } from '@/api/user'
import { Message } from 'element-ui';
import { Base64 } from 'js-base64'
export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length=0) {
        callback(new Error("Please enter the user name"));
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
     
      loginForm: {
        username: "",
        password: "",
        checked:""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
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

    var vm = this;
      // 在页面加载时从cookie获取登录信息
      let username = vm.getCookie("username");
      let password = Base64.decode( vm.getCookie("password"));

      // 如果存在赋值给表单，并且将记住密码勾选
      if (username) {
        vm.loginForm.username = username;
        vm.loginForm.password = password;
        vm.loginForm.checked = true;
      }

  },
  methods: {
     toRegister() {
      this.$router.push({ path: '/register' })
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
    handleLogin() {
       if (this.loginForm.password === '' || this.loginForm.username === '') {
        Message('账号或密码不能为空')
      } else {
        this.setUserInfo();
       // this.$router.push({ path: this.redirect || "/" });
        login(this.loginForm.password, this.loginForm.username).then((res) => {
          console.log(res)
          localStorage.setItem("token",res.token)
          localStorage.setItem('username', res.user.username)
           localStorage.setItem('email', res.user.email)
          localStorage.setItem('uid', res.user.id)
          
          if(res.user.user_pic===null){
         localStorage.setItem('imageUrl', "1.png")
          }else{
          localStorage.setItem('imageUrl', res.user.user_pic)
          }
          localStorage.setItem('roles', JSON.stringify(res.user.roles))
           this.$router.push({ path: this.redirect || "/" });
          if (res == 'Bad credentials') {
            Message('账号或密码错误，请重试')
          }
            })
          }

      }
    

  ,
   setUserInfo() {

        // 判断用户是否勾选记住密码，如果勾选，向cookie中储存登录信息，
        // 如果没有勾选，储存的信息为空
        if (this.loginForm.checked) {

         this.setCookie("username", this.loginForm.username);
          this.setCookie("password", Base64.encode(this.loginForm.password));
          this.setCookie("checked", this.loginForm.checked);
        } else {
          this.setCookie("username", "");
          this.setCookie("password", "");
        }
      },
  // 获取cookie
      getCookie: function(key) {
        if (document.cookie.length > 0) {
          var start = document.cookie.indexOf(key + '=')
          if (start !== -1) {
            start = start + key.length + 1
            var end = document.cookie.indexOf(';', start)
            if (end === -1) end = document.cookie.length
            return unescape(document.cookie.substring(start, end))
          }
        }
        return ''
      },
      // 保存cookie
      setCookie(cName, value, expiredays) {

        var exdate = new Date()
        exdate.setDate(exdate.getDate() + expiredays)
        document.cookie = cName + '=' + decodeURIComponent(value) +
          ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString())
      }

  }
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
  .title-container {
    position: relative;
   //height: 100px;

    .title {
      //position: relative;
      font-size: 26px;
      color: $light_gray;
       margin: 170px auto 20px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 30px 35px 0;
    margin: 0 auto;
    overflow: hidden;

  }
   .item {
    display: flex;
    align-items: center;
    // line-height: 30px;
    color: #fff;
    font-weight: 100;
    padding-bottom: 15px;
}

  .item label {
    width: 70px;

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



  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 80px;
    bottom: 6px;
  }
  .toRegister-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
