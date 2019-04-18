// import HelloWorld from "../src/components/HelloWorld.vue";
// import FSLine from "../srccomponents/FSLine.vue";
import Vue from "vue";
import Router from "vue-router";
import Test from "../src/components/Test.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "test",
      component: Test
    }
  ]
});
