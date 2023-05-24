<template>
  <div class="menu">
    <template>
      <!-- 搜索 -->
      <div class="menu-nav">
        <div class="menu-search">
          <van-search
            placeholder="请输入搜索关键词"
            input-align="center"
            shape="round"
          />
        </div>

        <div class="content">
          <!-- 侧边栏 -->
          <div class="sub-nav">
            <div
              class="sub-nav-item"
              v-for="(item, index) in subNavData"
              @click="toMenu(index, item.type)"
              :class="{ 'item-active': index == subNavIndex }"
            >
              <!-- 选项图标 -->
              <div class="sub-nav-icon">
                <img
                  class="auto_img"
                  :src="
                    index == subNavIndex ? item.activeIcon : item.inactiveIcon
                  "
                  alt="未找到"
                />
              </div>
              <!-- 名称 -->
              <div class="sub-nav-title">{{ item.title }}</div>
            </div>
          </div>
          <!-- 商品 -->
          <div class="product-item">
            <div
              class="product-item-card"
              v-for="(item, index) in productsData"
              @click="getDetail(item.pid,item)"
            >
              <div class="p-img">
                <img class="auto_img" :src="item.smallImg" alt="" />
              </div>
              <div class="p-contnet">
                <div class="one_text name">{{ item.name }}</div>
                <div class="one_text enname">{{ item.enname }}</div>
                <div class="price">￥{{ item.price }}</div>
              </div>
              <van-icon class="add" name="add" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<!-- 

    路由注册

 -->
<script>
import "../assets/less/menu.less";
export default {
  name: "Menu",
  data() {
    return {
      subNavIndex: 0,
      subNavData: [
        {
          title: "热卖推荐",
          activeIcon: require("../assets/images/icons_22.png"),
          inactiveIcon: require("../assets/images/icons_11.gif"),
        },
        {
          title: "拿铁",
          activeIcon: require("../assets/images/icons_19.gif"),
          inactiveIcon: require("../assets/images/icons_05.gif"),
        },
        {
          title: "咖啡",
          activeIcon: require("../assets/images/icons_18.gif"),
          inactiveIcon: require("../assets/images/icons_03.gif"),
        },
        {
          title: "瑞纳冰",
          activeIcon: require("../assets/images/icons_20.gif"),
          inactiveIcon: require("../assets/images/icons_07.gif"),
        },
        {
          title: "水果茶",
          activeIcon: require("../assets/images/icons_21.gif"),
          inactiveIcon: require("../assets/images/icons_09.gif"),
        },
      ],
      
      productsData: [],
    };
  },
  created() {
    this.getProductsData();
    // this.getProductByType();
  },
  methods: {
    // 切换
    toMenu(index, type) {
      if (this.subNavIndex == index) {
        return;
      }
      this.subNavIndex = index;
      this.getProductByType(type);
      // console.log(type);
    },
    // 获取商品数据
    getProductsData() {
      this.$toast.loading({
        message: "商品加载中...",
        forbidClick: false,
        duration: 0,
      });
      this.axios({
        method: "GET",
        url: "/type",
        params: {
          appkey: this.appkey,
        },
      })
        .then((result) => {
          this.$toast.clear();
          // console.log(result);
          if (result.data.code == 400) {
            let data = result.data.result;
            data.unshift({
              type: "isHot",
              typeDesc: "热卖推荐",
            });
            //   返回一个新数组
            this.subNavData.map((v) => {
              for (let i = 0; i < data.length; i++) {
                if (v.title == data[i].typeDesc) {
                  v.type = data[i].type;
                  break;
                }
              }
            });
            let type = this.subNavData[this.subNavIndex].type;
            // console.log(this.subNavData);
            // 获取数据
            this.getProductByType(type);
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    // 根据类型获取数据
    getProductByType(type) {
      let params = {
        appkey: this.appkey,
      };
      if (type == "isHot") {
        params.key = "isHot";
        params.value = 1;
      } else {
        params.key = "type";
        params.value = type;
      }
      this.$toast.loading({
        message: "商品加载中...",
        forbidClick: false,
        duration: 0,
      });
      this.axios({
        url: "/typeProducts",
        method: "GET",
        params,
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == 500) {
            this.productsData = result.data.result;
            // console.log(this.productsData);
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
  
    getDetail(pid,item){
      this.$router.push({name:'Details',params:{pid}});
      item.time = (new Date()).toLocaleDateString() + " " + (new Date()).toLocaleTimeString()
      this.$store.commit('addTrackCount',item)
    }
  },
};
</script>
<style lang="less" scoped>