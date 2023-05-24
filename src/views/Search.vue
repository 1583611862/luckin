<template>
  <div class="search">
    <BgBox></BgBox>
    <van-nav-bar left-text="返回" left-arrow @click-left="back" fixed>
      <template #right>
        <div class="home-search">
          <van-search
            shape="round"
            show-action
            placeholder="请输入商品关键词"
            ref="search"
            @search="search"
            v-model="name"
          />
        </div>
      </template>
    </van-nav-bar>
    <!-- 内容组件 -->
    <div class="clearfix search-item">
      <div class="fl items">
        <ProductItem
          v-for="(item, index) in products"
          :item="item"
        ></ProductItem>
      </div>
    </div>
  </div>
</template>

<script>
import BgBox from "../components/BgBox.vue";
import ProductItem from "../components/ProductItem";
import "../assets/less/search.less";
export default {
  name: "Search",
  data() {
    return {
      products: [],
      name: "",
    };
  },
  created() {
    this.$nextTick(() => {
      let searchIpt = this.$refs.search.querySelector('[type="search"]');
      // console.log(searchIpt);
    });
    // this.search("coffee001");
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    search(name) {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: false,
        duration: 0,
      });
      this.axios({
        method: "GET",
        url: "/search",
        params: {
          appkey: this.appkey,
          name,
        },
      })
        .then((result) => {
          this.$toast.clear();
          console.log(result);
          if (result.data.code == "Q001") {
            this.products = result.data.result;
            // console.log(this.products);
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch((err) => {
          console.log(err);
          this.$toast.clear();
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
.search {
  z-index: 99;
}
</style>
