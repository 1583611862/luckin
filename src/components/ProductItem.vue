<template>
  <div class="search-pro-card" @click="getDetail(item.pid, item)">
    <div class="search-pro-img">
      <img class="auto_img" :src="item.smallImg" alt="" />
    </div>
    <div class="pro-content">
      <div class="pro-name one_text">{{ item.name }}</div>
      <div class="pro-enname one_text">{{ item.enname }}</div>
      <div class="price fl">￥ {{ item.price }}</div>
    </div>
    <div class="delete fr" @click.stop="remove()" v-if="isRemove">
      <van-icon name="clear" />
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductItem",
  data() {
    return {};
  },
  created() {},
  props: {
    item: {
      type: Object,
      default() {
        return {};
      },
    },
    isRemove: {
      type: Boolean,
      default() {
        false;
      },
    },
  },
  methods: {
    getDetail(pid, item) {
      this.$router.push({ name: "Details", params: { pid } });
      item.time =
        new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
      this.$store.commit("addTrackCount", item);
    },
    // 移除
    remove() {
      this.$emit("remove");
    },
  },
  components: {},
};
</script>

<style lang="less" scoped>
.search-pro-card {
  display: flex;
  justify-content: left;
  align-items: center;
  width: 300px;
  padding: 10px;
  margin: 10px 0;
  background-color: #fff;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0px 5px 3px 0px #d1d1d1;
}

.search-pro-img {
  width: 40%;
  border-radius: 10px;
  overflow: hidden;
}
.pro-content {
  /* height: 100%; */
  width: 150px;
  margin-left: 15px;
}
.pro-name {
  font-size: 20px;
  font-weight: 700;
  padding-bottom: 5px;
  color: #182078;
}
.pro-enname {
  font-size: 12px;
  color: #999;
  margin-bottom: 40px;
}
.price {
  font-size: 20px;
  font-weight: 700;
  color: tomato;
}
.delete {
  margin-top: 90px;
  font-size: 20px;
  color: #182078;
}
</style>
