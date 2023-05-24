<template>
  <div class="mine">
    <!-- 背景 -->
    <!-- v-if 避免请求服务器资源路径错误 -->
    <div
      class="my-bg"
      v-if="userInfo.userImg"
      :style="{ backgroundImage: `url('${userInfo.userBg}') ` }"
    >
      <van-uploader class="img-upload" :after-read="uploadBgImg" />
    </div>
    <!-- 内容 -->
    <div class="my-content">
      <!-- 头像 -->
      <div class="my-info">
        <div class="my-head-img">
          <img :src="userInfo.userImg" alt="" />
        </div>
        <div class="my-text">
          <div class="my-name">{{ userInfo.nickName }}</div>
          <div class="one_text personalSignature">
            {{ userInfo.desc == "" ? "这人很懒，什么都没有哦" : userInfo.desc }}
          </div>
        </div>
      </div>

      <div class="option-list">
        <van-cell
          v-for="(item, index) in listData"
          :title="item.title"
          is-link
          @click="JumpRoute(item.name)"
        />
      </div>
    </div>
  </div>
</template>
<!-- 

    路由注册

 -->
<script>
import "../assets/less/mine.less";
export default {
  name: "Mine",
  data() {
    return {
      userInfo: [],
      listData: [
        {
          title: "个人资料",
          name: "Account",
        },
        {
          title: "我的订单",
          name: "MyOrder",
        },
        {
          title: "我的收藏",
          name: "Like",
        },
        {
          title: "地址管理",
          name: "Address",
        },
        {
          title: "我的足迹",
          name: "Track",
        },
        {
          title: "安全中心",
          name: "Secure",
        },
      ],
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      let tokenString = localStorage.getItem("token");

      // 发起服务请求
      if (!tokenString) {
        this.$toast("请先登录哦~");
        return this.$router.push({ name: "Login" });
      }
      this.axios({
        method: "GET", //请求类型
        url: "/findMy",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        // 存储数据
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else if (result.data.code == "A001") {
            this.userInfo = result.data.result[0];
            // console.log(this.userInfo);
          }
        })
        .catch((err) => {
          console.log(err);
          this.$toast.clear();
        });
    },
    // 上传背景
    uploadBgImg(file) {
      // 允许上传的类型
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
        url: "/updateUserBg",
        data: {
          appkey: this.appkey,
          tokenString,
          imgType,
          serverBase64Img,
        },
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == "I001") {
            this.userInfo.userBg = result.data.userBg;
          }

          this.$toast.success(result.data.msg);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 功能跳转
    JumpRoute(route) {
      this.$router.push({ name: route });
    },
  },
};
</script>
<style lang="less" scoped></style>
