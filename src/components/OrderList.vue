<template>
  <div class="order-list">
    <div class="pro-box clearfix">
      <div class="info-box">
        <div class="info-title fl">{{ infoTitleLeft }}</div>
        <div class="reinfo fr" v-if="isRight">
          <div v-if="!isReceive" @click="confirmReceive">
            确认收货
            <van-icon name="success" size="16"></van-icon>
          </div>
          <div v-else class="clearfix">
            <div class="fl">已完成</div>
            <div class="fl delete" @click="remove">
              <van-icon name="delete" size="16"></van-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--  -->
    <div class="cell-list">
      <slot></slot>
    </div>
    <!-- 底部 -->
    <div class="bottom-into clearfix">
      <div class="circle">
        <div class="fl circle-box circle-left"></div>
        <div class="fr circle-box circle-right"></div>
      </div>
      <div class="date fl" v-if="date != ''">{{ date }}</div>
      <div class="num-price fr">
        <div class="count">共{{ count }}件商品</div>
        <div class="total">合计:</div>
        <span>￥{{ total }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrderList",
  props: {
    infoTitleLeft: {
      type: String,
      default: "",
    },

    isRight: {
      type: Boolean,
      default: false,
    },

    date: {
      type: String,
      default: "1970-01-01 00:00:00",
    },

    // 商品数量
    count: {
      type: Number,
      default: 0,
    },
    // 订单总金额
    total: {
      type: [Number, String],
      default: 0,
    },

    //确认收货
    isReceive: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    // 确认收货
    confirmReceive() {
      this.$emit("confirm-receive");
    },
    // 删除订单
    remove() {
      this.$emit("remove");
    },
  },
};
</script>

<style lang="less" scoped>
.order-list {
  display: flex;
  flex-direction: column;
  justify-content: left;
  .cell-list {
    border-top: 1px dotted #999;
  }
  .pro-box {
    padding-bottom: 5px;
    margin-bottom: 5px;
    .reinfo {
      color: #999;
    }
  }
  .bottom-into {
    margin-top: 10px;
    line-height: 10px;
    .date {
      color: #999;
    }
    .num-price {
      display: flex;
      align-items: baseline;
      vertical-align: center;
      .count {
        margin-right: 5px;
      }
      span {
        font-size: 16px;
        font-weight: 600;
      }
    }
  }
}
</style>
