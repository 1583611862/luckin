<template>
  <div class="pay">
    <BgBox :title="title"></BgBox>
    <div class="pay-box">
      <!-- 地址 -->
      <div class="select-address">
        <!-- 用户 -->
        <div class="user-box">
          <div class="userinfo">
            <div class="username">{{ currentAddress.name }}</div>
            <div class="userphone">{{ currentAddress.tel }}</div>
            <div class="default-address" v-if="currentAddress.isDefault"></div>
          </div>
          <div class="detail-address">{{ currentAddress.address }}</div>
        </div>
        <!-- 选择地址 -->
        <div @click="showAddress" class="more-address">
          <span>选择地址<van-icon name="arrow" /></span>
        </div>
      </div>
      <!-- 订单 -->
      <div class="order-info">
        <!-- 商品信息 -->
        <OrderList
          info-title-left="订单信息"
          :count="productInfo.count"
          :total="productInfo.total"
          :date="productInfo.date | formatDate('yyyy-MM-dd hh:mm:ss')"
        >
          <OrderItem
            v-for="(item, index) in products"
            :item="item"
            :key="index"
          ></OrderItem>
        </OrderList>
      </div>
    </div>
    <!-- 结算 -->
    <div class="settlement">
      <van-button block round @click="paybox">立即结算</van-button>
    </div>
    <!-- 选择地址 -->
    <div class="select-address-list">
      <van-popup v-model:show="isOpen" position="bottom">
        <van-address-list
          v-model="chosenAddressId"
          :list="list"
          default-tag-text="默认"
          @add="newAddress"
          @select="selectAddress"
        />
      </van-popup>
    </div>
  </div>
</template>
<script>
import BgBox from "../components/BgBox.vue";
import OrderList from "../components/OrderList";
import OrderItem from "../components/OrderItem";
export default {
  name: "Pay",
  data() {
    return {
      title: "支付",
      isOpen: false,
      list: [],
      // 选择当前地址
      currentAddress: {},
      // 当前地址aid
      chosenAddressId: "",
      //
      sids: [],
      // 商品数据
      products: [],
      // 商品信息和金额
      productInfo: {
        count: 0,
        total: 0,
      },
    };
  },
  components: {
    BgBox,
    OrderList,
    OrderItem,
  },
  created() {
    this.sids = this.$route.query.sids.split("-");
    this.getAddressData();
    this.getShopbagBySids();
  },
  methods: {
    newAddress() {
      this.$router.push({ name: "NewAddress" });
    },
    // 获取地址列表
    getAddressData() {
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
        method: "GET",
        url: "/findAddress",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      }).then((result) => {
        this.$toast.clear();
        // console.log(result);
        if (result.data.code == 700) {
          this.$router.push({ name: "Login" });
        } else if (result.data.code == 20000) {
          result.data.result.map((v) => {
            v.isDefault = Boolean(v.isDefault);
            v.id = v.aid;
            v.address = `${v.province}${v.city}${v.county}${v.addressDetail}`;

            if (v.isDefault) {
              this.currentAddress = v;
              this.chosenAddressId = v.id;
            }
          });
          this.list = result.data.result;
        }
      });
    },
    // 根据sids获取购物袋数据
    getShopbagBySids() {
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
        method: "GET",
        url: "/commitShopcart",
        params: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(this.sids),
        },
      })
        .then((result) => {
          // console.log(result);
          this.$toast.clear();
          if (result.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 50000) {
            // 若没有商品
            if (result.data.result.length == 0) {
              return this.$router.push({ name: "ShopBag" });
            }
            result.data.result.map((v) => {
              this.productInfo.count += v.count;
              this.productInfo.total += v.count * v.price;
              this.productInfo.date = v.updated_at;
            });
            this.products = result.data.result;
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    //选择地址
    selectAddress(item, index) {
      this.isOpen != this.isOpen;
      this.currentAddress = item;
    },
    // 展示地址列表
    showAddress() {
      this.isOpen = true;
    },
    // 结算订单
    pay() {
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
        url: "/pay",
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(this.sids),
          phone: this.currentAddress.tel,
          address: this.currentAddress.address,
          receiver: this.currentAddress.name,
        },
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else {
            this.$toast.success(result.data.msg);
            setTimeout(() => {
              this.$router.push({ name: "MyOrder" });
            }, 1000);
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    // 结算
    paybox() {
      if (!this.chosenAddressId) {
        this.$toast("请选择地址");
        return;
      }
      this.$dialog
        .confirm({
          title: "确认订单",
          message: "是否进行结算",
        })
        .then((result) => {
          this.$toast.clear();
          this.pay();
          this.$toast.success("提交成功");
        });
    },
  },
};
</script>

<style lang="less" scoped>
.pay {
  display: flex;
  justify-content: center;
  align-items: center;
}
.pay-box {
  position: relative;
  margin: 80px 10px 0px 10px;
  padding: 10px;
  background-color: #fff;
  border-radius: 15px;
  overflow: hidden;
}
.settlement {
  position: absolute;
  bottom: 10px;
  width: 90%;
}

.settlement .van-button--default {
  color: #fff;
  background: linear-gradient(to right, #404dd9, #182078);
  border: none;
}
.order-info {
  margin-top: 15px;
}
.select-address-list .van-popup--bottom {
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}
.select-address-list .van-button--danger {
  background: linear-gradient(to right, #404dd9, #182078);
  border: none;
}
.select-address {
  display: flex;
  justify-content: left;
  align-items: center;
}
.username {
  font-size: 16px;
  font-weight: bold;
}
.userphone {
  margin-bottom: 5px;
}
.more-address {
  margin-left: auto;
  text-align: center;
  color: #999;
}
</style>
