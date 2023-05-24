<template>
  <div class="main">
    <!-- 配置二级路由 -->
    <div>
      <router-view></router-view>
    </div>
    <!-- 底部导航栏 -->
    <van-tabbar
      v-model="activeName"
      active-color="#182078"
      inactive-color="#ccc"
      route
    >
    <!-- roter -->
      <van-tabbar-item
        v-for="(item, index) in tabBarData"
        :key="index"
        :icon="item.icon"
        replace
        :to="item.path"
        :name="item.name"
      >
        <span>{{ item.title }}</span>
        <!-- 作用域插槽 -->
        <template #icon="props">
          <img :src="props.active ? item.activeImg : item.inactiveImg" />
        </template>
        <!-- ----- -->
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
export default {
  name: "Main",

  data() {
    return {
      activeName: "Home",
      tabBarData: [
        {
          title: "首页",
          icon: "home-o",
          name: "Home",
          path: "/main/home",
          inactiveImg: require("../assets/images/home.png"),
          activeImg: require("../assets/images/home_active.png"),
        },
        {
          title: "菜单",
          icon: "search",
          name: "Menu",
          path: "/main/menu",
          inactiveImg: require("../assets/images/menu.png"),
          activeImg: require("../assets/images/menu_active.png"),
        },
        {
          title: "购物袋",
          icon: "friends-o",
          name: "ShopBag",
          path: "/main/shopbag",
          num: "",
          inactiveImg: require("../assets/images/shopbag.png"),
          activeImg: require("../assets/images/shopbag_active.png"),
        },
        {
          title: "我的",
          icon: "setting-o",
          name: "Mine",
          path: "/main/mine",
          inactiveImg: require("../assets/images/my.png"),
          activeImg: require("../assets/images/my_active.png"),
        },
      ],
    };
  },
};
</script>
<style lang="less" scoped></style>
