<template>
  <div class="details">
    <!-- 顶部 -->
    <van-nav-bar
      title="商品详情"
      left-text="返回"
      left-arrow
      fixed
      @click-left="back"
    />
    <!-- content -->
    <div>
      <!-- img -->
      <div class="pro-img">
        <img class="auto_img" :src="productDetail.large_img" alt="" />
      </div>
      <!-- pro info -->
      <div class="pro-info-box">
        <div class="pro-info">
          <!-- 商品名 -->
          <div class="clearfix title">
            <div class="fl">
              <div class="one_text pro-name">{{ productDetail.name }}</div>
              <div class="one_text pro-enname">{{ productDetail.enname }}</div>
            </div>
            <div class="fr price">￥{{ productDetail.price }}</div>
          </div>
          <!-- 规格 -->
          <div class="rule-box">
            <div
              class="clearfix rule-item"
              v-for="(item, index) in productDetail.rules"
              :key="index"
            >
              <div class="fl rule-title">{{ item.title }}</div>
              <div class="fl rule-index">
                <div
                  class="fl r-index"
                  :class="{
                    'r-active': item.ruleIndex == i,
                    'r-sm-text': v.title.length >= 3,
                  }"
                  v-for="(v, i) in item.rule"
                  :Key="i"
                  @click="toRule(item, i)"
                >
                  {{ v.title }}
                </div>
              </div>
            </div>
          </div>
          <!-- 数量 -->
          <div class="pro-count-box">
            <div class="count-title">选择数量</div>
            <div class="count-box fr">
              <van-stepper
                v-model="product.count"
                theme="round"
                button-size="22"
                disable-input
              />
            </div>
          </div>
          <!-- 描述 -->
          <div class="desc-box">
            <div class="desc-title">商品描述</div>
            <div class="desc-content">
              <ol>
                <li v-for="(item, index) in productDetail.desc" :key="index">
                  {{ index + 1 }}、{{ item }}
                </li>
              </ol>
            </div>
          </div>
          <!-- 底部加购 -->
        </div>
      </div>
    </div>
    <!-- 底部 -->
    <div class="bottom-nav">
      <van-goods-action>
        <van-goods-action-icon
          icon="bag"
          text="购物袋"
          :badge="bagCount == 0 ? '' : bagCount"
          @click="goShopBag"
        />
        <van-goods-action-icon
          icon="like"
          :text="islike ? '已收藏' : '收藏'"
          :color="islike ? 'tomato' : '#999'"
          @click="toggeleLike"
        />
        <van-goods-action-button
          color="#616cdf"
          text="加入购物袋"
          @click="addShopBag()"
        />
        <van-goods-action-button
          color="#182078"
          text="立即购买"
          @click="buy(true)"
        />
      </van-goods-action>
    </div>
  </div>
</template>

<script>
import "../assets/less/details.less";
export default {
  name: "Details",
  data() {
    return {
      pid: "",
      product: {
        count: 1,
      },
      bagCount: 0,
      productDetail: {},
      islike: false,
    };
  },
  created() {
    this.pid = this.$route.params.pid;
    // console.log(this.pid);
    this.getProductDetail();
    // console.log(this.productDetail.rules);
    this.findlike();
    // 获取购物车内容数量
    this.shopBagCount();
  },
  methods: {
    // 获取数据
    getProductDetail() {
      this.$toast.loading({
        message: "商品加载中...",
        forbidClick: false,
        duration: 0,
      });
      this.axios({
        method: "GET",
        url: "/productDetail",
        params: {
          appkey: this.appkey,
          pid: this.pid,
        },
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == 600) {
            let data = result.data.result[0];
            data.desc = data.desc.split(/\n/);
            let rules = [];
            let rulesData = ["tem", "sugar", "milk", "cream"];
            rulesData.map((v) => {
              let r = {};
              r.title = data[v + "_desc"];
              r.ruleIndex = 0;
              r.rule = [];
              let ruleString = data[v].split("/");
              ruleString.map((value) => {
                if (value != "") {
                  r.rule.push({ title: value });
                }
              });
              if (r.rule.length > 0) {
                rules.push(r);
              }
            });
            data.rules = rules;
            this.productDetail = data;
            // console.log(this.productDetail.desc);
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log(err);
        });
    },
    // 点击改变规格
    toRule(item, i) {
      if (item.ruleIndex == i) {
        return;
      } else {
        item.ruleIndex = i;
      }
    },

    back() {
      this.$router.go(-1);
      // history.back()
    },
    //收藏该商品
    toggeleLike() {
      // 获取token
      let tokenString = localStorage.getItem("token");
      if (!tokenString) {
        //跳回登录页面
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }
      this.$toast.loading("收藏中...");
      // 动态获取url
      let url = this.islike ? "/notlike" : "/like";
      // 发起请求
      this.axios({
        method: "POST",
        url,
        data: {
          appkey: this.appkey,
          pid: this.pid,
          tokenString,
        },
      })
        .then((result) => {
          // console.log(result);
          this.$toast.clear();
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 800) {
            // 成功收藏
            this.islike = true;
          } else if (result.data.code == 900) {
            // 取消收藏
            this.islike = false;
          }
          this.$toast.success(result.data.msg);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 查询用户是否收藏该商品
    findlike() {
      let tokenString = localStorage.getItem("token");
      if (!tokenString) {
        //跳回登录页面
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }
      this.axios({
        method: "GET",
        url: "/findlike",
        params: {
          appkey: this.appkey,
          pid: this.pid,
          tokenString,
        },
      })
        .then((result) => {
          if (result.data.code == 1000) {
            if (result.data.result.length > 0) {
              this.islike = true;
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 查询购物袋内容数量
    shopBagCount() {
      let tokenString = localStorage.getItem("token");
      if (!tokenString) {
        //跳回登录页面
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }
      this.$toast.loading({
        message: "商品加载中...",
        forbidClick: false,
        duration: 0,
      });
      this.axios({
        method: "GET",
        url: "/shopcartCount",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
          // console.log(result);
          if (result.data.code == 4000) {
            this.bagCount = result.data.result;
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    //  加入购物袋
    addShopBag(isBuy) {
      let tokenString = localStorage.getItem("token");
      if (!tokenString) {
        //跳回登录页面
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }
      // 请求参数
      let data = {
        tokenString,
        appkey: this.appkey,
        pid: this.pid,
        count: this.product.count,
      };
      // 遍历product 里面的 rule  获取商品规格
      let rs = [];
      this.productDetail.rules.map((v) => {
        rs.push(v.rule[v.ruleIndex].title);
      });
      data.rule = rs.join("/");
      // ---------
      this.$toast.loading({
        message: "加入中...",
        forbidClick: false,
        duration: 0,
      });
      // 发起请求
      this.axios({
        method: "POST",
        url: "/addShopcart",
        data,
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 3000) {
            if (!isBuy) {
              //加入购物袋
              if (result.data.status == 1) {
                this.bagCount++;
              }
              this.$toast(result.data.msg);
            } else {
              //立即购买
              this.$router.push({
                name: "Pay",
                query: { sids: result.data.sid },
              });
            }
          }
        })
        .catch((err) => {
          console.log(msg);
        });
    },
    // 立即购买
    buy(isBuy) {
      this.addShopBag(isBuy);
    },
    // 购物袋
    goShopBag() {
      this.$router.push({ name: "ShopBag" });
    },
  },
};
</script>

<style lang="css" scoped></style>
