<template>
  <div class="myOrder">
    <!-- top -->
    <div class="order-top">
      <van-nav-bar
        title="我的订单"
        left-text="返回"
        left-arrow
        fixed
        @click-left="back()"
      />
    </div>
    <!-- table切换 -->
    <div class="table">
      <van-tabs
        v-model="tableIndex"
        type="card"
        
        color="#182078"
        @change="changeTable"
      >
        <van-tab
          v-for="(item, index) in tableData"
          :title="item.title"
          :key="index"
        >
          <!-- 内容 -->
          <div v-if="orderData.length > 0">
            <div class="order-box" v-for="(v, k) in orderData" :key="v.oid">
              <OrderList
                :info-title-left="v.oid"
                :date="v.date | formatDate('yyyy-MM-dd hh:mm:ss')"
                :count="v.count"
                :total="v.total | decimal"
                :is-right="true"
                @confirm-receive="confirmReceive(v, k)"
                @remove="removeOrder(v.oid, k)"
                :is-receive="v.status == 2"
              >
                <OrderItem
                  v-for="(value, idx) in v.data"
                  :item="value"
                  :key="idx"
                ></OrderItem
              ></OrderList>
            </div>
          </div>
          <!-- 空状态 -->
          <div v-else>
            <van-empty>没有东西哦</van-empty>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import BgBox from "../components/BgBox.vue";
import OrderList from "../components/OrderList";
import OrderItem from "../components/OrderItem";
export default {
  name: "MyOrder",
  data() {
    return {
      tableIndex: 0,
      tableData: [{ title: "全部" }, { title: "进行中" }, { title: "已完成" }],
      orderData: [],
      isHas: true,
    };
  },
  created() {
    this.getOrderDataByStatus(5);
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    // 请求订单数据
    getOrderDataByStatus() {
      let tokenString = localStorage.getItem("token");
      if (!tokenString) {
        //跳回登录页面
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }
      this.$toast.loading("订单加载中....");
      this.axios({
        mehtod: "GET",
        url: "/findOrder",
        params: {
          appkey: this.appkey,
          tokenString,
          status: this.tableIndex,
        },
      })
        .then((result) => {
          // console.log(result);
          this.$toast.clear();
          if (result.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 70000) {
            if (this.tableIndex == 0 && result.data.result.length == 0) {
              this.isHas = false;
              return;
            }
            // 根据oid进行分类
            let orderDatas = [];
            result.data.result.map((v) => {
              for (let i = 0; i < orderDatas.length; i++) {
                if (orderDatas[i].oid == v.oid) {
                  orderDatas[i].data.push(v);
                  orderDatas[i].count += v.count;
                  orderDatas[i].total += v.count * v.price;
                  return;
                }
              }
              let o = {};
              o.oid = v.oid;
              o.count = v.count;
              o.total = v.count * v.price;
              o.status = v.status;
              o.date = v.createdAt;
              o.data = [v];
              orderDatas.push(o);
            });
            this.orderData = orderDatas;
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    // 切换订单状态
    changeTable(name, title) {
      // 0-全部// 1-进行中// 2-已完成
      this.getOrderDataByStatus();
    },
    //确认收货
    confirmReceive(item, index) {
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
        url: "/receive",
        data: {
          appkey: this.appkey,
          tokenString,
          oid: item.oid,
        },
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 80000) {
            if (this.tableIndex == 1) {
              this.orderData.splice(index, 1);
            }
            item.status = 2;
          }
          this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    // 删除订单
    removeOrder(oid, index) {
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
        url: "/removeOrder",
        data: {
          appkey: this.appkey,
          tokenString,
          oid,
        },
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 90000) {
            this.orderData.splice(index, 1);
          }
          this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
  },
  components: {
    OrderList,
    OrderItem,
  },
};
</script>

<style lang="less">
.myOrder {
  .table {
    margin-top: 50px;
    .van-tabs__nav--card {
      border-radius: 15px;
      /* border: none; */
      .van-tab {
        border: none;
      }
    }
    .van-tab--active {
      border-radius: 15px;
    }
  }
  .order-box {
    margin: 10px;
    padding: 15px;
    background-color: #fff;
    border-radius: 15px;
  }
}
</style>
