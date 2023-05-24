<template>
  <div class="track">
    <!-- top -->
    <van-nav-bar
      title="足迹"
      left-text="返回"
      :right-text="!isEdit ? '编辑' : '完成'"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <div class="sortingTitle">
      <div class="trackAll">足迹</div>
      <div class="delAll" v-if="isEdit" @click="allRemove">清空</div>
    </div>
    <van-empty v-if="trackCount.length == 0" description="没有足迹" />
    <!--  -->
    <div class="item" v-for="(item, index) in trackCount">
      <div>{{ item.time }}</div>
      <ProductItem
        :item="item"
        :Key="index"
        :isRemove="true"
        @remove="remove(index)"
      >
      </ProductItem>
    </div>
    <!-- end -->
  </div>
</template>

<script>
import ProductItem from "../components/ProductItem";
export default {
  name: "Track",
  data() {
    return {
      track: [],
      isEdit: false,
      isAllChecked: false,
    };
  },
  computed: {
    trackCount() {
      console.log(this.$store.state.footprintData);
      return this.$store.state.footprintData;
    },
  },
  components: {
    ProductItem,
  },
  methods: {
    //全删除
    allRemove() {
      if (this.trackCount.length == 0) {
        this.isEdit = !this.isEdit;
        this.$toast("没有足迹了");
        return;
      }
      this.$dialog
        .confirm({
          title: "清空足迹",
          message: "清空后无法恢复",
        })
        .then(() => {
          this.$store.commit("delAllTrack");
          this.isEdit = !this.isEdit;
        })
        .catch((err) => {});
    },
    //单个删除
    remove(index) {
      this.$store.commit("removeOne", index);
    },
    // 编辑
    onClickRight() {
      this.isEdit = !this.isEdit;
    },
    //返回
    onClickLeft() {
      this.$router.go(-1);
    },

    goDetail(pid) {
      this.$router.push({ name: "Detail", params: { pid } });
    },
  },
};
</script>
<style lang="less" scoped>
.item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.trackAll,
.delAll {
  width: 100px;
  height: 25px;
  margin: 10px 0;
  text-align: center;
  line-height: 25px;
  font-size: 16px;
  border-radius: 15px;
  background-color: #fff;
  border: 2px solid #182078;
}
.trackAll {
  margin-left: 90px;
}
.sortingTitle {
  width: 100%;
  display: flex;
  justify-content: left;
}
</style>
