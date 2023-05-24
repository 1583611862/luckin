<template>
  <div class="shopbag">
    <!-- 购物袋top -->
    <van-nav-bar
      title="购物袋"
      left-text="返回"
      left-arrow
      @click-left="back"
      fixed
    >
      <template #right>
        <div v-if="ShopBagData.length > 0" @click="isEdit = !isEdit">
          {{ isEdit ? "完成" : "编辑" }}
        </div>
      </template>
    </van-nav-bar>
    <!-- bg -->
    <div class="ofe-bg">
      <img class="auto_img" src="../assets//images/shopbag_bg.png" alt="" />
    </div>
    <!-- 空状态 -->
    <div v-if="ShopBagData.length == 0" class="empty">
      <van-empty description="什么都没有哦" />
      <van-button>去逛一逛~</van-button>
    </div>
    <div class="shopbag-box" v-else>
      <div class="bg"></div>
      <!-- 懒加载 -->
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="loadData"
      >
        <!-- 商品 -->
        <div class="shopbag-product">
          <div
            class="shopbag-item"
            v-for="(item, index) in ShopBagData"
            :key="item.sid"
          >
            <div class="cell-item">
              <van-swipe-cell :disabled="!isEdit">
                <!-- 商品 -->
                <div class="cell-item-box">
                  <div class="check-box">
                    <van-checkbox
                      v-model="item.isCheck"
                      @change="simpleSelect"
                    />
                  </div>
                  <!--  -->
                  <div class="product-info-box">
                    <div class="product-img">
                      <img :src="item.small_img" alt="" />
                    </div>
                    <div class="info-text">
                      <div class="name">{{ item.name }}</div>
                      <div class="one_text enname">{{ item.enname }}</div>
                      <div class="rule">{{ item.rule }}</div>
                      <!-- 计步器 -->
                      <div class="info-count">
                        <div class="price">
                          {{ (item.price * item.count).toFixed(2) }}
                        </div>
                        <div class="step">
                          <van-stepper
                            v-model="item.count"
                            theme="round"
                            button-size="20"
                            disable-input
                            @change="changeCount(item)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 左滑动删除 -->
                <template #right>
                  <van-button
                    square
                    type="danger"
                    text="删除"
                    @click="removeOne(index, item.sid)"
                  />
                </template>
              </van-swipe-cell>
            </div>
          </div>
        </div>
      </van-list>
      <!-- 提交 -->
      <div class="submit">
        <van-submit-bar
          :price="total"
          button-text="提交订单"
          @submit="commit"
          v-if="!isEdit"
        >
          <van-checkbox v-model="isAllCheck" @click="allSelect"
            >全选</van-checkbox
          ></van-submit-bar
        >
        <!-- 删除 -->
        <van-submit-bar
          button-text="删除选择"
          button-color="#ff0500"
          @submit="removeSelect"
          v-else
        >
          <van-checkbox
            v-model="isAllCheck"
            @click="allSelect"
            style="margin-right: 154px"
            >全选</van-checkbox
          ></van-submit-bar
        >
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/shopbag.less";
export default {
  name: "ShopBag",
  data() {
    return {
      // 是否选中商品
      isCheck: false,
      count: 2,
      isAllCheck: false,
      // 懒加载
      loading: true,
      // 内容数据
      allShopData: [],
      // 要渲染的数据
      ShopBagData: [],
      // 滑动加载
      dataCount: 8,
      // 截取购物袋位置
      startIndex: 0,
      // 订单总金额
      total: 0,
      // 是否编辑
      isEdit: false,
      // 是否全部加载完成
      finished: false,
    };
  },
  created() {
    this.getShopBagData();
    this.loadData();
    this.sum();
  },
  methods: {
    // 获取购物袋数据
    getShopBagData() {
      let tokenString = localStorage.getItem("token");
      if (!tokenString) {
        //跳回登录页面
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }
      this.$toast.loading("获取中...");
      this.axios({
        method: "GET",
        url: "/findAllShopcart",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          // console.log(result);
          this.$toast.clear();
          if (result.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 5000) {
            result.data.result.map((v) => {
              v.isChecked = false;
            });
            this.allShopData = result.data.result;
            this.ShopBagData = this.allShopData.slice(
              this.startIndex,
              this.startIndex + this.dataCount
            );
            // 已加载数据
            this.startIndex += this.dataCount;
            // 未加载数据
            this.loading = false;
          }
          // console.log(this.allShopData,'1');
          // console.log(this.ShopBagData);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 懒加载购物袋数据
    loadData() {
      setTimeout(() => {
        let data = this.allShopData.slice(
          this.startIndex,
          this.startIndex + this.dataCount
        );
        this.startIndex += this.dataCount;
        this.ShopBagData.push(...data);
        this.isAllCheck = false;
        // 数据不满8条，不截取数据
        if (data.length < this.dataCount) {
          this.finished = true;
        } else {
          // 有数据则触发onloading‘
          this.loading = false;
        }
      }, 1500);
    },
    // back
    back() {
      this.$router.go(-1);
    },
    // 全选
    allSelect() {
      this.ShopBagData.map((v) => {
        v.isCheck = this.isAllCheck;
      });
      this.sum();
    },
    // 单选
    simpleSelect() {
      this.sum();
      for (let i = 0; i < this.ShopBagData.length; i++) {
        // 单选操作
        if (!this.ShopBagData[i].isCheck) {
          this.isAllCheck = false;
          return;
        }
        this.isAllCheck = true;
      }
    },
    // 删除
    removeOne(index, sid) {
      let tokenString = localStorage.getItem("token");
      if (!tokenString) {
        //跳回登录页面
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }
      this.axios({
        method: "POST",
        url: "/deleteShopcart",
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify([sid]),
        },
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 7000) {
            this.ShopBagData.splice(index, 1);
            this.sum();
          }
          this.$toast.success(result.data.msg);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 判断用户是否勾选商品
    isSelectProduct(msg) {
      for (let i = 0; i < this.ShopBagData.length; i++) {
        if (this.ShopBagData[i].isCheck) {
          return true;
        }
      }
    },
    // 删除勾选的商品
    removeSelect() {
      let isHas = this.isSelectProduct();
      if (!isHas) {
        this.$toast("请选择商品");
        return;
      }
      let sids = [];
      this.ShopBagData.map((v) => {
        if (v.isCheck) {
          sids.push(v.sid);
        }
      });
      // -------
      let tokenString = localStorage.getItem("token");
      if (!tokenString) {
        //跳回登录页面
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }
      this.axios({
        method: "POST",
        url: "/deleteShopcart",
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(sids),
        },
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 7000) {
            // 移除商品
            for (let i = 0; i < this.ShopBagData.length; i++) {
              if (this.ShopBagData[i].isCheck) {
                this.ShopBagData.splice(i, 1);
                i--;
              }
            }
            this.sum();
          }
          this.$toast.success(result.data.msg);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 计算总金额
    sum() {
      this.total = 0;
      this.ShopBagData.map((v) => {
        if (v.isCheck) {
          this.total += v.price * v.count;
        }
      });
      this.total *= 100;
    },
    // 修改数量
    changeCount(item) {
      let tokenString = localStorage.getItem("token");
      if (!tokenString) {
        //跳回登录页面
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }
      this.axios({
        method: "POST",
        url: "/modifyShopcartCount",
        data: {
          appkey: this.appkey,
          tokenString,
          sid: item.sid,
          count: item.count,
        },
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 6000) {
            if (item.isCheck) {
              this.sum();
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 提交订单
    commit() {
      let isHas = this.isSelectProduct();
      if (!isHas) {
        this.$toast.fail("请选择商品");
        return;
      }
      //
      let sids = [];
      this.ShopBagData.map((v) => {
        if (v.isCheck) {
          sids.push(v.sid);
        }

        this.$router.push({ name: "Pay", query: { sids: sids.join("-") } });
      });
    },
  },
};
</script>
<style lang="less" scoped></style>
