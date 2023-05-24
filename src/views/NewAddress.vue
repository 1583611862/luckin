<template>
  <div class="newaddress">
    <van-nav-bar
      :title="aid ? '编辑地址' : '新增地址'"
      left-text="返回"
      left-arrow
      @click-left="back"
    />
    <div class="edit">
      <van-address-edit
        :area-list="areaList"
        show-postal
        :show-delete="aid ? true : false"
        show-set-default
        :area-columns-placeholder="['选择省', '选择市', '选择区']"
        @save="save"
        @delete="removeAddress"
        :address-info="addressInfo"
        save-button-text="保存地址"
      />
    </div>
  </div>
</template>
<script>
import areaList from "../assets/js/area";
export default {
  name: "NewAddress",
  data() {
    return {
      // 地址
      areaList,
      addressInfo: {},
      aid: "",
    };
  },
  created() {
    this.aid = this.$route.query.aid;
    if (this.aid) {
      this.getAddressDataByAid();
    }
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    // 通过aid获取用户地址
    getAddressDataByAid() {
      let tokenString = localStorage.getItem("token");
      this.$toast.loading({
        message: "获取中...",
        forbidClick: false,
        duration: 0,
      });
      this.axios({
        url: "/findAddressByAid",
        method: "GET",
        params: {
          appkey: this.appkey,
          tokenString,
          aid: this.aid,
        },
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 40000) {
            let data = result.data.result[0];
            data.isDefault = Boolean(data.isDefault);
            this.addressInfo = data;
          }
        })
        .catch((err) => {
          this.$toast(err);
        });
    },
    // 保存地址
    save(content) {
      let tokenString = localStorage.getItem("token");
      this.$toast.loading({
        message: "获取中...",
        forbidClick: false,
        duration: 0,
      });
      // 复制地址content
      let addressInfo = Object.assign({}, content);
      delete addressInfo.country;
      addressInfo.tokenString = tokenString;
      addressInfo.appkey = this.appkey;
      addressInfo.isDefault = Number(addressInfo.isDefault);
      // 请求数据,判断用户是否有aid
      if (!this.aid) {
        this.address(addressInfo, "/addAddress");
      } else {
        // 编辑 验证用户是否编辑过原来地址
        let isModify = false;
        for (let key in this.addressInfo) {
          if (content[key] != this.addressInfo[key]) {
            isModify = true;
          }
        }
        if (isModify) {
          this.address(addressInfo, "/editAddress");
        } else {
          return this.$toast("你还没有修改信息哦");
        }
      }
    },

    address(addressInfo, url) {
      this.axios({
        method: "POST",
        url,
        data: addressInfo,
      })
        .then((result) => {
          this.$toast.clear();

          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 9000 || result.data.code == 30000) {
            setTimeout(() => {
              this.$router.push({ name: "Address" });
            }, 500);
          }

          this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    // 删除地址
    removeAddress() {
      let tokenString = localStorage.getItem("token");
      if (!tokenString) {
        //跳回登录页面
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
        url: "/deleteAddress",
        data: {
          appkey: this.appkey,
          tokenString,
          aid: this.aid,
        },
      })
        .then((result) => {
          this.$toast.clear();

          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 10000) {
            setTimeout(() => {
              this.$router.push({ name: "Address" });
            }, 500);
          }

          this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
  },
};
</script>
<style lang="css" >
 .van-button--danger {
  color: #fff;
  background-color: #182078;
  border: none;
}
</style>
