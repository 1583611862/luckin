<template>
  <div class="login">
    <!-- <h1>注册</h1> -->
    <div class="login-top">
      <van-nav-bar right-text="首页" @click-right="goHome('Home')">
        <template #left>
          <div class="nav-left">
            <div class="logo">
              <img class="auto_img" src="../assets/images/home_active.png" />
            </div>
            <div class="logo-text">Luckin Coffee</div>
          </div>
        </template>
      </van-nav-bar>
    </div>
    <!-- 内容 -->
    <div class="user-box">
      <div class="welcome">欢迎回来!</div>
      <div class="welcome-en">Please login to your account !</div>
      <!-- 登录表单 -->
      <div class="from-box">
        <van-form>
          <van-field
            v-model="userInfo.phone"
            name="手机号"
            label="手机号"
            placeholder="手机号"
            autocapitalize="off"
          />
          <van-field
            v-model="userInfo.password"
            name="密码"
            label="密码"
            placeholder="密码（6-16位）"
            autocapitalize="off"
            right-icon="closed-eye"
            :type="isLogPwdShow ? 'text' : 'password'"
            :right-icon="isLogPwdShow ? 'eye-o' : 'closed-eye'"
            @click-right-icon="isLogPwdShow = !isLogPwdShow"
          />
          <!-- 忘记密码 -->
          <div class="forgotPassword fr">
            <span @click="goForgot">忘记密码?</span>
          </div>
          <!-- 登录 -->
          <div class="submit">
            <van-button
              round
              block
              type="primary"
              native-type="button"
              color="#182078"
              @click="login"
            >
              提交
            </van-button>
            <van-button
              round
              block
              native-type="button"
              class="login-btn"
              @click="isShow = !isShow"
            >
              注册
            </van-button>
          </div>
        </van-form>
      </div>
      <!-- 注册表单 弹出层-->
      <van-popup
        v-model="isShow"
        class="register-box"
        closeable
        position="bottom"
      >
        <div class="register-title">注册</div>
        <div class="register-content">
          <!-- 注册start -->
          <van-form>
            <van-field
              v-model="userRegisterInfo.phone"
              name="手机号"
              label="手机号"
              placeholder="手机号"
              autocapitalize="off"
            />
            <van-field
              v-model="userRegisterInfo.password"
              name="密码"
              label="密码"
              autocapitalize="off"
              placeholder="密码(1-16位)"
              :type="isRegPwdShow ? 'text' : 'password'"
              :right-icon="isRegPwdShow ? 'eye-o' : 'closed-eye'"
              @click-right-icon="isRegPwdShow = !isRegPwdShow"
            />
            <van-field
              v-model="userRegisterInfo.nickName"
              name="昵称"
              label="昵称"
              autocapitalize="off"
              placeholder="昵称(1-10位)"
            />
            <div style="margin: 50px 10px 10px 10px">
              <van-button
                round
                block
                type="primary"
                native-type="button"
                color="#182078"
                @click="register"
              >
                注册
              </van-button>
            </div>
          </van-form>
          <!-- 注册end -->
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import "../assets/less/login.less";
import { validForm } from "../assets/js/validForm";
export default {
  name: "Login",
  data() {
    return {
      // 用户登录
      userInfo: {
        phone: "",
        password: "",
      },
      userRegisterInfo: {
        phone: "",
        password: "",
        nickName: "",
      },
      // 注册信息
      isShow: false,
      isLogPwdShow: false,
      isRegPwdShow: false,
    };
  },
  methods: {
    goHome(name) {
      this.$router.push({ name });
    },
    goForgot() {
      this.$router.push({ name: "Forgot" });
    },
    // 发起注册请求
    register() {
      let o = {
        phone: {
          value: this.userRegisterInfo.phone,
          errorMsg: "手机号格式不正确",
          reg: /^1[3-9]\d{9}$/,
        },
        password: {
          value: this.userRegisterInfo.password,
          errorMsg: "密码支持数字字母下划线组合，且必须以字母开头，6-16位",
          reg: /^[A-Za-z]\w{5,15}$/,
        },
        nickName: {
          value: this.userRegisterInfo.nickName,
          errorMsg: "请输入正确昵称，且1-10位",
          reg: /^[\w\u4e00-\u9fa5]{1,10}$/,
        },
      };

      let isPass = validForm.valid(o);
      // console.log("字符串匹配 = " + isPass);
      // ----

      if (isPass) {
        // 接收信息 发送axios 进行注册
        let userInfo = Object.assign({}, this.userRegisterInfo);
        userInfo.appkey = this.appkey;
        // console.log(userInfo);

        // ----
        this.$toast.loading({
          message: "注册中...",
          forbidclick: false,
          duration: 0,
        });
        // 发起注册
        this.axios({
          method: "POST",
          url: "/register",
          data: userInfo,
        })
          .then((result) => {
            this.$toast.clear();
            console.log(result);
            if (result.data.code == 100) {
              this.isShow = false;
            } else {
              this.$toast(result.data.msg);
            }
          })
          .catch((err) => {
            console.log(err.response);
            this.$toast.clear();
          });
      }
    },
    // 登录
    login() {
      let o = {
        phone: {
          value: this.userInfo.phone,
          errorMsg: "手机号格式不正确",
          reg: /^1[3-9]\d{9}$/,
        },
        password: {
          value: this.userInfo.password,
          errorMsg: "密码支持数字字母下划线组合，且必须以字母开头，6-16位",
          reg: /^[A-Za-z]\w{5,15}$/,
        },
      };
      let isPass = validForm.valid(o);
      if (isPass) {
        let userInfo = Object.assign({}, this.userInfo);
        userInfo.appkey = this.appkey;
        console.log(this.userInfo);   
        this.$toast.loading({
          message: "登录中...",
          forbidclick: false,
          duration: 0,
        });
        this.axios({
          url: "/login",
          method: "POST",
          data: userInfo,
        })
          .then((result) => {
            this.$toast.clear();
            // console.log(result);
            if (result.data.code == 200) {
              localStorage.setItem("token", result.data.token);
              this.$router.push({ name: "Home" });
            } else {
              this.$toast(result.data.msg);
            }
          })
          .catch((err) => {
            this.$toast.clear();
          });
      }
    },
  },
};
</script>
