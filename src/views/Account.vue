<template>
  <div class="account">
    <!-- 顶部 -->
    <BgBox :title="title"></BgBox>
    <!-- 数据 -->
    <div class="personal-data">
      <!-- 头像 -->
      <van-cell center title="头像" class="userImg">
        <div class="u-img">
          <van-uploader :after-read="uploadUserImg">
            <img class="auto_img fr" :src="userInfo.userImg" />
          </van-uploader>
        </div>
      </van-cell>
      <!--  -->
      <van-cell center title="用户ID" :value="userInfo.userId" />
      <van-cell center title="手机号" :value="userInfo.phone" />
      <!-- 修改名称 -->
      <van-cell center title="昵称" class="nickname">
        <van-field
          v-model="userInfo.nickName"
          placeholder="输入昵称"
          maxlength="12"
          @change="updataNickname"
        />
      </van-cell>
      <!-- 简介 -->
      <van-cell title="简介" class="desc">
        <van-field
          v-model="userInfo.desc"
          rows="2"
          autosize
          type="textarea"
          maxlength="50"
          placeholder="请输入简介"
          show-word-limit
          input-align="left"
          @change="updateDesc"
        />
      </van-cell>
    </div>
  </div>
</template>

<script>
import BgBox from "../components/BgBox.vue";
import "../assets/less/account.less";
export default {
  name: "Account",
  data() {
    return {
      userInfo: [],
      title: "个人简介",
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    //获取用户信息
    getUserInfo() {
      let tokenString = localStorage.getItem("token");

      // 发起服务请求
      if (!tokenString) {
        this.$toast("请先登录哦~");
        return this.$router.push({ name: "Login" });
      }
      this.axios({
        method: "GET", //请求类型
        url: "/findAccountInfo",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        // 存储数据
        .then((result) => {
          this.$toast.clear();
          // console.log(result);
          if (result.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else if (result.data.code == "B001") {
            this.userInfo = result.data.result[0];
            this.nickName = this.userInfo.nickName;
          }
        })
        .catch((err) => {
          console.log(err);
          this.$toast.clear();
        });
    },
    // 上传头像
    uploadUserImg(file) {
      let type = ["jpg", "png", "jpeg", "webp"];
      // limit Size
      let size = 1;
      // 判断类型
      // console.log(file);
      let imgType = file.file.type.split("/")[1];
      if (type.indexOf(imgType) === -1) {
        this.$toast("文件仅支持" + `${type.join(",")}`);
        return;
      }
      // 判断大小
      let fileSize = file.file.size / 1024 / 1024;
      if (fileSize > size) {
        this.$toast(`仅支持${size}M以下文件`);
        return;
      }
      // set base64
      let serverBase64Img = file.content.replace(
        /^data:image\/[A-Za-z]+;base64,/,
        ""
      );

      let tokenString = localStorage.getItem("token");
      this.$toast.loading("上传中...");
      this.axios({
        method: "POST",
        url: "/updateAvatar",
        data: {
          appkey: this.appkey,
          tokenString,
          imgType,
          serverBase64Img,
        },
      })
        .then((result) => {
          this.$toast.clear();
          console.log(result);
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == "H001") {
            this.userInfo.userImg = result.data.userImg;
          }

          this.$toast.success(result.data.msg);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 修改昵称
    updataNickname() {
      let tokenString = localStorage.getItem("token");
      if (!tokenString) {
        //跳回登录页面
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }
      if (this.userInfo.nickName == "") {
        this.$toast("名字不能为空");
        return;
      }
      this.axios({
        method: "POST",
        url: "/updateNickName",
        data: {
          appkey: this.appkey,
          tokenString,
          nickName: this.userInfo.nickName,
        },
      })
        .then((result) => {
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == "C001") {
            this.$toast.success(result.data.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 修改简介
    updateDesc() {
      let tokenString = localStorage.getItem("token");
      if (!tokenString) {
        //跳回登录页面
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }
      if (this.userInfo.desc == "") {
        this.$toast("简介不能为空");
        return;
      }
      this.axios({
        method: "POST",
        url: "/updateDesc",
        data: {
          appkey: this.appkey,
          tokenString,
          desc: this.userInfo.desc,
        },
      })
        .then((result) => {
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == "D001") {
            this.$toast.success(result.data.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  components: {
    BgBox,
  },
};
</script>
