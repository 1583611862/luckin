<template>
  <div class="address my-address">
    <van-nav-bar
      title="地址管理"
      left-text="返回"
      left-arrow
      @click-left="back()"
    />

    <div class="addressList">
      <van-address-list
        :list="list"
        default-tag-text="默认"
        :switchable="false"
        @add="add"
        @edit="edit"
      />
    </div>
    <!-- 如果没有地址 -->
    <div v-show="list.length === 0">
      <van-empty description="还没有地址哦" />
    </div>
  </div>
</template>

<script>
import BgBox from "../components/BgBox";
export default {
  name: "Address",
  data() {
    return {
      title: "地址管理",
      list: [],
    };
  },
  created() {
    this.getAddress();
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    getAddress() {
      let tokenString = localStorage.getItem("token");
      this.$toast.loading({
        message: "获取中...",
        forbidClick: false,
        duration: 0,
      });
      this.axios({
        url: "/findAddress",
        method: "GET",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
          // console.log(result);
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 20000) {
            result.data.result.map((v) => {
              v.isDefault = Boolean(v.isDefault);
              v.id = v.aid;
              v.address = `${v.province}${v.city}${v.county}${v.addressDetail}`;
            });
            this.list = result.data.result;
          }
        })
        .catch((err) => {
          this.$toast(err);
        });
    },
    // 新增地址
    add() {
      this.$router.push({ name: "NewAddress" });
    },
    edit(item) {
      this.$router.push({ name: "NewAddress", query: { aid: item.aid } });
    },
  },
  components: {
    BgBox,
  },
};
</script>

<style lang="less" scoped>
.van-button--danger {
  color: #fff;
  background-color: #182078;
  border: 0.02667rem solid #182078;
}
</style>
