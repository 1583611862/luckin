<template>
  <div class="secure">
    <BgBox :title="title"></BgBox>
    <!-- 修改密码 -->
    <div class="cell-box">
      <van-cell
        title="修改密码"
        is-link
        :center="true"
        @click="openPasswordBox"
      />
      <van-cell
        title="注销账号"
        is-link
        :center="true"
        @click="destroyAccount"
      />
    </div>
    <!-- 退出登录 -->
    <div class="logout-box">
      <van-button color="#1A73E8" block round @click="logout"
        >退出登录</van-button
      >
    </div>
    <!-- 弹出 -->
    <van-popup is-link position="bottom" closeable v-model="isOpen">
      <div class="form-box">
        <div class="form-title">修改密码</div>
        <van-form>
          <van-field
            v-model="password.oldPassword"
            :type="isPassword ? 'password' : 'text'"
            name="旧密码"
            label="旧密码"
            placeholder="旧密码(首字符必须为字母)"
            :right-icon="isPassword ? 'closed-eye' : 'eye-o'"
            autocomplete="off"
            @click-right-icon="toggleType"
          />

          <van-field
            v-model="password.newPassword"
            :type="isPassword ? 'password' : 'text'"
            name="新密码"
            label="新密码"
            placeholder="新密码(首字符必须为字母)"
            :right-icon="isPassword ? 'closed-eye' : 'eye-o'"
            autocomplete="off"
            @click-right-icon="toggleType"
          />

          <div class="commit-btn">
            <van-button round block color="#1A73E8" @click="commit"
              >提交</van-button
            >
          </div>
        </van-form>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { validForm } from "../assets/js/validForm.js";
import BgBox from "../components/BgBox.vue";
export default {
  name: "Secure",
  data() {
    return {
      title: "安全中心",
      isOpen: false,
      isPassword: true,
      password: {
        oldPassword: "",
        newPassword: "",
      },
    };
  },
  components: {
    BgBox,
  },
  methods: {
    toggleType() {
      this.isPassword = !this.isPassword;
    },
    openPasswordBox() {
      this.isOpen = true;
    },
    // 注销登录
    destroyAccount() {
      this.$dialog
        .confirm({
          title: "注销账号",
          message: "是否确定注销账号，一旦注销无法恢复！",
        })
        .then(() => {
          let tokenString = localStorage.getItem("token");
          if (!tokenString) {
            this.$toast("请先登录");
            return this.$router.push({ name: "Login" });
          }
          this.$toast.loading({
            message: "加载中...",
            forbidClick: true,
            duration: 0,
          });
          this.axios({
            method: "POST",
            url: "/destroyAccount",
            params: {
              appkey: this.appkey,
              tokenString,
            },
          })
            .then((result) => {
              this.$toast.clear();
              if (result.data.code == 700) {
                this.$router.push({ name: "Login" });
              } else if (result.data.code == "G001") {
                setTimeout(() => {
                  localStorage.removeItem("token");
                  this.$router.push({ name: "Login" });
                }, 800);
              }

              this.$toast(result.data.msg);
            })
            .catch((err) => {
              this.$toast.clear();
            });
        })
        .catch((err) => {});
    },
    //退出登录
    logout() {
      this.$dialog
        .confirm({
          title: "退出登录",
          message: "是否确定退出登录！",
          confirmButtonColor: "#1A73E8",
        })
        .then(() => {
          this.$toast.loading({
            message: "加载中...",
            forbidClick: true,
            duration: 0,
          });

          setTimeout(() => {
            this.$toast.clear();
            localStorage.removeItem("token");
            this.$router.push({ name: "Login" });
          }, 800);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //提交修改密码
    commit() {
      //构造表单验证信息
      let o = {
        oldPassword: {
          value: this.password.oldPassword,
          errorMsg: "旧密码由数字字母下划线组合(6-16字符),且必须字母开头",
          reg: /^[A-Za-z]\w{5,15}$/,
        },
        newPassword: {
          value: this.password.newPassword,
          errorMsg: "新密码由数字字母下划线组合(6-16字符)，且必须字母开头",
          reg: /^[A-Za-z]\w{5,15}$/,
        },
      };
      let isPass = validForm.valid(o);
      //如果表单验证通过
      if (isPass) {
        if (this.password.newPassword == this.password.oldPassword) {
          this.$toast("新密码和旧密码不能相同");
          return;
        }
        let tokenString = localStorage.getItem("token");
        if (!tokenString) {
          this.$toast("请先登录");
          return this.$router.push({ name: "Login" });
        }
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0,
        });
        // 发出请求
        this.axios({
          method: "POST",
          url: "/updatePassword",
          data: {
            appkey: this.appkey,
            password: this.password.newPassword,
            oldPassword: this.password.oldPassword,
            tokenString,
          },
        })
          .then((result) => {
            this.$toast.clear();
            if (result.data.code == 700) {
              this.$router.push({ name: "Login" });
            } else if (result.data.code == "E001") {
              setTimeout(() => {
                //
                this.$toast.success("修改成功,请重新登录");
                localStorage.removeItem("token");
                this.$router.push({ name: "Login" });
              }, 800);
            }
            this.$toast(result.data.msg);
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
.cell-box {
  margin: 0 10px;
  margin-top: 150px;
  border-radius: 15px;
  overflow: hidden;
}
.logout-box {
  position: fixed;
  bottom: 10px;
  left: 20px;
  width: 90%;
}
.van-popup--bottom {
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}
.form-title {
  margin: 20px 10px;
}
.form-box {
  margin: 10px;
}
.van-cell {
  padding: 10px;
}
.commit-btn {
  margin-top: 20px;
}
</style>
