<template>
  <div class="order-item">
    <div class="cell-item-box">
      <div class="pro-info-box">
        <!-- 图片 -->
        <div class="pro-img">
          <img class="auto-img" :src="item.small_img || item.smallImg" alt="" />
        </div>
        <!-- 信息 -->
        <div class="pro-info">
          <div class="pro-info-text">
            <div class="names">
              <div class="pro-name">{{ item.name }}</div>
              <div class="pro-enname one_text">{{ item.enname }}</div>
              <div class="pro-rule">{{ item.rule }}</div>
            </div>
          </div>
          <div class="pro-count-box">
            <div class="step-box">x{{ item.count }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrderItem",
  props: {
    item: {
      type: Object,
      default() {
        return {
          name: "名称",
          rule: "规格",
          enname: "英文名称",
          price: 0,
          count: 1,
        };
      },
    },
  },
};
</script>

<style lang="less" scoped>
  .order-item{
    margin: 10px 0;
  }
.pro-info-box {
  display: flex;
  justify-content: left;
}
.pro-img {
  width: 105px;
  margin-right: 10px;
}
.pro-img img {
  width: 100%;
  border-radius: 50%;
  overflow: hidden;
}
.names {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.pro-name {
  font-size: 16px;
  font-weight: 600;
  color: #182078;
}
.pro-rule {
  margin-top: 30px;
  color: #999;
}
.pro-enname {
  width: 150px;
}
.pro-info {
  display: flex;
  justify-content: center;
  align-content: center;
}
.pro-info-text {
  display: flex;
  justify-content: stretch;
  align-content: center;
}
.pro-count-box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  margin-left: 40px;
  font-size: 14px;
  color: #999;
}
</style>
