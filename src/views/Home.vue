<template>
  <div class="home">
    <!-- 顶部搜索start -->
    <van-nav-bar>
      <!-- 左侧 -->
      <template #left>
        <div class="home-nav">
          <div class="t1">{{ hello }}</div>
          <div class="t2">{{userInfo.nickName}}</div>
        </div>
      </template>
      <!-- 右侧 -->
      <template #right>
        <div class="home-search">
          <van-search
            placeholder="请输入搜索关键词"
            shape="round"
            @focus="searchFocus"
          />
        </div>
      </template>
    </van-nav-bar>
    <!-- 轮播start -->
    <div class="home-content">
      <div class="banner-swipe">
        <van-swipe
          class="my-swipe auto_img"
          :autoplay="3000"
          indicator-color="#182078"
        >
          <van-swipe-item
            v-for="(item, index) in BannerSwiptData"
            :key="index"
            @click="getDetail(item.pid,item)"
            ><img class="auto_img" :src="item.bannerImg" alt="瑞纳冰"
          /></van-swipe-item>
        </van-swipe>
      </div>
      <!-- 商品start -->
      <div class="product-list">
        <template>
          <!-- 热卖banner -->
          <div class="bestSellers">
            <span>热卖推荐 :</span>
          </div>
          <div class="products">
            <!-- 商品 -->
            <div
              class="products-card"
              v-for="(item, index) in hotProducts"
              @click="getDetail(item.pid,item)"
            >
              <div class="img-box">
                <img :src="item.smallImg" alt="瑞纳冰" />
              </div>
              <div class="info">
                <div class="name one_text">{{ item.name }}</div>
                <div class="enname one_text">{{ item.enname }}</div>
                <div class="price">￥{{ item.price }}</div>
              </div>
              <div class="hot">hot</div>
            </div>
          </div>
        </template>
      </div>

      <div class="none">木有啦 ~ 不要再划了 ~</div>
    </div>
  </div>
</template>
<script>
import "../assets/less/home.less";
import { showLoadingToast } from "vant";
// 默认导出组件
export default {
  // 组件名称
  name: "Home",
  data() {
    return {
      BannerSwiptData: [],
      hello: "",
      hotProducts: [],
      userInfo:[]
    };
  },
  created() {
    this.getBannerSwiptData();
    this.getDate();
    this.getHotProducts();
    this.getUserInfo()
  },
  methods: {
    // 获取数据
    getBannerSwiptData() {
      // 调用提示

      this.$toast.loading({
        // 提示文字 点击穿透 延迟
        message: "加载中...",
        forbidClick: false,
        // 延迟
        duration: 0,
      });

      // 发起服务请求
      this.axios({
        method: "GET", //请求类型
        url: "/banner",
        // data用数组 prames用对象
        params: {
          appkey: this.appkey,
        },
      })
        // 存储数据
        .then((result) => {
          this.$toast.clear();

          if (result.data.code == 300) {
            this.BannerSwiptData = result.data.result;
          }
        })
        .catch((err) => {
          console.log(err);
          this.$toast.clear();
        });
    },
    
    getDate() {
      let hour = new Date().getHours();
      if (hour < 11) {
        this.hello = "早上好 ~";
      } else if (hour < 14) {
        this.hello = "中午好 ~";
      } else if (hour < 18) {
        this.hello = "下午好 ~";
      } else {
        this.hello = "晚上好 ~";
      }
    },
    
    getHotProducts() {
      this.$toast.loading({
        message: "商品加载中...",
        forbidClick: false,
        duration: 0,
      });
      this.axios({
        url: "/typeProducts",
        method: "GET",
        params: {
          appkey: this.appkey,
          key: "isHot",
          value: 1,
        },
      }).then((result) => {
        this.$toast.clear();
        if (result.data.code == 500) {
          this.hotProducts = result.data.result;
          // console.log(this.hotProducts);
        }
      });
    },
    // 查看商品详情 传pid
    getDetail(pid,item) {
      this.$router.push({ name: "Details", params: { pid } });

      item.time = (new Date()).toLocaleDateString() + " " + (new Date()).toLocaleTimeString()
      this.$store.commit('addTrackCount',item)
    },
    // 搜索跳转
    searchFocus() {
      this.$router.push({ name: "Search" });
    },
  // ---
    getUserInfo(){
      let tokenString = localStorage.getItem('token')

      // 发起服务请求
      if(!tokenString){
        return
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
          if (result.data.code =='A001') {
            this.userInfo = result.data.result[0];
            // console.log(this.userInfo);
          }
        })
        .catch((err) => {
          console.log(err);
          this.$toast.clear();
        });
    }
  
  },
};
</script>
<style lang="less" scoped>