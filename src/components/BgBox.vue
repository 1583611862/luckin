<template>
  <div class="bg-box">
    <van-nav-bar
      :title="title"
      left-text="返回"
      left-arrow
      @click-left="back"
      fixed
    />
    <div class="bg">
      <slot> </slot>
    </div>
  </div>
</template>

<script>
import ProductItem from "./ProductItem.vue";
export default {
  name: "bgbox",
  data() {
    return {};
  },
  props: ["title"],
  methods: {
    back() {
      this.$router.go(-1);
    },
  },
  components: { ProductItem },
};
</script>

<style lang="less" scoped>
.bg {
  position: fixed;
  top: 0px;
  height: 200px;
  width: 100%;
  background-color: #182078;
  /* z-index: -1; */
}
.bg-content {
  position: relative;
  top: -25px;
  margin: 0 10px;
  padding: 10px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  background-color: yellow;
  overflow: hidden;
}
</style>
