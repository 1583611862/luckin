import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

const routes = [
  //  一级路由
  {
    path: "/main",
    name: "Main",
    component: () => import("../views/Main.vue"),
    children: [
      {
        path: "home",
        name: "Home",
        component: () => import("../views/Home.vue"),
      },
      {
        path: "menu",
        name: "Menu",
        component: () => import("../views/Menu"),
      },
      {
        path: "shopbag",
        name: "ShopBag",
        component: () => import("../views/ShopBag"),
      },
      {
        path: "mine",
        name: "Mine",
        component: () => import("../views/Mine"),
      },
    ],
  },
  {
    path: "/details/:pid",
    name: "Details",
    component: () => import("../views/Details.vue"),
  },
  {
    path: "/search",
    name: "Search",
    component: () => import("../views/Search.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/forgot",
    name: "Forgot",
    component: () => import("../views/Forgot.vue"),
  },
  {
    path: "/account",
    name: "Account",
    component: () => import("../views/Account.vue"),
  },
  {
    path: "/myOrder",
    name: "MyOrder",
    component: () => import("../views/MyOrder.vue"),
  },
  {
    path: "/like",
    name: "Like",
    component: () => import("../views/Like.vue"),
  },
  {
    path: "/address",
    name: "Address",
    component: () => import("../views/Address.vue"),
  },
  {
    path: "/track",
    name: "Track",
    component: () => import("../views/Track.vue"),
  },
  {
    path: "/secure",
    name: "Secure",
    component: () => import("../views/Secure.vue"),
  },
  {
    path: "/newaddress",
    name: "NewAddress",
    component: () => import("../views/NewAddress.vue"),
  },
  {
    path: "/pay",
    name: "Pay",
    component: () => import("../views/Pay.vue"),
  },
  //  路由重定向
  {
    path: "*",
    redirect: {
      name: "Home",
    },
  },
];

const router = new VueRouter({
  routes,
});

export default router;
