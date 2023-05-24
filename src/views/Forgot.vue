<template>
  <div class="login">
    <van-nav-bar
      left-text="返回"
      left-arrow
      right-text="首页"
      @click-right="goState('Home')"
    >
    </van-nav-bar>

    <div class="user-box">
      <div class="user-title">
        <div class="welcome">找回密码</div>
        <div class="sub-title">Find password</div>
      </div>

      <van-form v-show="!isNext">
        <van-field
          v-model="userInfo.email"
          name="邮箱"
          label="邮箱"
          placeholder="邮箱"
          autocomplete="off"
        />

        <van-field
          v-model="userInfo.code"
          name="验证码"
          label="验证码"
          placeholder="验证码(6个字符)"
          autocomplete="off"
          maxlength="6"
        >
          <template #button>
            <van-button
              size="small"
              color="#1A73E8"
              :disabled="isSend"
              @click="getValidCode"
              >{{ text }}</van-button
            >
          </template>
        </van-field>
        <div class="forgot">
          <span @click="goState('Login')">已有账号，立即登录</span>
        </div>

        <div class="commit-btn">
          <van-button @click="next" round block color="#1A73E8">
            下一步
          </van-button>
        </div>
      </van-form>

      <van-form v-show="isNext">
        <van-field
          v-model="userInfo.phone"
          name="手机号"
          label="手机号"
          placeholder="手机号"
          autocomplete="off"
        />

        <van-field
          v-model="userInfo.password"
          :type="isRegisterPassword ? 'password' : 'text'"
          name="密码"
          label="密码"
          placeholder="密码必须为字母开头"
          :right-icon="isRegisterPassword ? 'closed-eye' : 'eye-o'"
          autocomplete="off"
          @click-right-icon="toggleRegsiterPasswordType"
        />
        <div class="forgot">
          <span @click="goState('Login')">已有账号，立即登录</span>
        </div>

        <div class="commit-btn">
          <van-button round block color="#1A73E8" @click="commit">
            提交
          </van-button>
        </div>
        <div class="commit-btn">
          <van-button round block type="default" @click="back()">
            返回
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
//导入外部样式表
import "../assets/less/login.less";

//导入表单验证模块
import { validForm } from "../assets/js/validForm";

export default {
  name: "Login",
  data() {
    return {
      //用户信息
      userInfo: {
        phone: "",
        password: "",
        email: "",
        code: "",
      },

      //切换注册密码框的类型
      isRegisterPassword: true,

      //是否下一步
      isNext: false,

      //是否发送
      isSend: false,

      text: "发送验证码",
    };
  },

  methods: {
    back() {
      this.isNext = false;
    },

    //切换注册框
    toggleRegisterBox() {
      this.isShow = true;
    },

    //切换注册密码框的类型
    toggleRegsiterPasswordType() {
      this.isRegisterPassword = !this.isRegisterPassword;
    },

    //下一步
    next() {
      let o = {
        email: {
          value: this.userInfo.email,
          errorMsg: "邮箱格式不正确",
          reg: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        },
        code: {
          value: this.userInfo.code,
          errorMsg: "验证码格式不正确",
          reg: /^[A-Za-z\d]{6}$/,
        },
      };

      let isPass = validForm.valid(o);
      if (isPass) {
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0,
        });
        this.axios({
          method: "POST",
          url: "/checkValidCode",
          data: {
            appkey: this.appkey,
            validCode: this.userInfo.code,
          },
        })
          .then((result) => {
            this.$toast.clear();
            this.$toast(result.data.msg);
            if (result.data.code == "K001") {
              this.isNext = true;
            }
          })
          .catch((err) => {
            this.$toast.clear();
          });
      }
    },

    goState(name) {
      this.$router.push({ name });
    },

    //获取邮箱验证码
    getValidCode() {
      let o = {
        email: {
          value: this.userInfo.email,
          errorMsg: "邮箱格式不正确",
          reg: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        },
      };
      let isPass = validForm.valid(o);
      if (!isPass) {
        return;
      }
      let time = 60;
      this.isSend = true;
      this.text = `${time}秒后重新发送`;
      let timer = setInterval(() => {
        if (time <= 0) {
          clearInterval(timer);
          timer = null;
          time = 60;
          this.isSend = false;
        } else {
          time--;
          this.text = `${time}秒后重新发送`;
        }
      }, 1000);
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      this.axios({
        method: "POST",
        url: "/emailValidCode",
        data: {
          appkey: this.appkey,
          email: this.userInfo.email,
        },
      })
        .then((result) => {
          console.log(result);
          this.$toast.clear();
          this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    //提交
    commit() {
      let o = {
        phone: {
          value: this.userInfo.phone,
          errorMsg: "手机号格式不正确",
          reg: /^1[3-9]\d{9}$/,
        },
        password: {
          value: this.userInfo.password,
          errorMsg: "新密码由数字字母下划线组合(6-16字符)",
          reg: /^[A-Za-z]\w{5,15}$/,
        },
      };

      let isPass = validForm.valid(o);
      if (isPass) {
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0,
        });
        this.axios({
          method: "POST",
          url: "/retrievePassword",
          data: {
            appkey: this.appkey,
            phone: this.userInfo.phone,
            password: this.userInfo.password,
          },
        })
          .then((result) => {
            this.$toast.clear();
            this.$toast(result.data.msg);
            if (result.data.code == "L001") {
              setTimeout(() => {
                this.goState("Login");
              }, 800);
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

<style lang="less" scoped>
.sub-title {
  margin: 5px 0;
  font-size: 14px;
  color: #999;
}
.van-cell {
  margin: 10px 0;
}
.forgot {
  margin: 10px 0 50px 0;
}
.forgot span {
  float: right;
  color: #999;
}
</style>
