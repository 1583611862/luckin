<template>
  <div class="like">
    <BgBox :title="title"> </BgBox>
    <div class="likes" v-if="likeProduct.length > 0">
      <div class="like-item" v-for="(item, index) in likeProduct">
        <ProductItem
          :item="item"
          :isRemove="true"
          @remove="removeLike(item.pid, index)"
        ></ProductItem>
      </div>
    </div>
    <div v-else class="none"><van-empty description="什么都没有哦" /></div>
  </div>
</template>

<script>
import BgBox from "../components/BgBox";
import ProductItem from "../components/ProductItem";
export default {
  name: "Like",
  data() {
    return {
      title: "收藏",
      likeProduct: [],
    };
  },
  created() {
    this.getAllLike();
  },
  methods: {
    getAllLike() {
      let tokenString = localStorage.getItem("token");
      this.$toast.loading({
        message: "加载中...",
        forbidClick: false,
        duration: 0,
      });
      this.axios({
        url: "/findAllLike",
        method: "GET",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          // console.log(result);
          this.$toast.clear();
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 2000) {
            this.likeProduct = result.data.result;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 删除商品
    removeLike(pid, index) {
      let tokenString = localStorage.getItem("token");
      this.$toast.loading({
        message: "删除中...",
        forbidClick: false,
        duration: 0,
      });
      this.axios({
        url: "/notlike",
        method: "POST",
        data: {
          appkey: this.appkey,
          tokenString,
          pid,
        },
      })
        .then((result) => {
          this.$toast.clear();
          // console.log(result);
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 900) {
            this.$toast.success("移除成功");
            this.likeProduct.splice(index, 1);
          } else {
            this.$toast("删除失败");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  components: {
    BgBox,
    ProductItem,
  },
};
</script>

<style lang="less" scoped>
.likes {
  position: relative;
  top: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 20px;
  border-radius: 15px;
  overflow: auto;
  background-color: #fff;
}
.none {
  margin-top: 150px;
}
</style>
