<template>
  <div class id>
    <div class="logo">
      <img src="../assets/icon.jpg" alt height="450px" width="450px">
    </div>
    <div class="form">
      <div class="login">
        <label for="name">账号</label>
        <input id="name" v-model="loginName" type="text" autofocus>
      </div>
      <div class="login">
        <label for="password">密码</label>
        <input id="password" v-model="passWord" type="password">
      </div>
      <div class="login login_other">
        <!-- <div class="other_btn">注册</div>
        <div class="other_btn">忘记密码</div> -->
        <el-button type="text">注册</el-button>
        <el-button type="text" >忘记密码</el-button>
      </div>
     <!--  <div class="login_btn" @click="login">登录</div> -->
     <el-button type="primary" @click="login" class="login_btn">登录</el-button>
    </div>
  </div>
</template>


<script>
import axios from "../../config/axios.js";
import { createConnect } from "../socket.js";
import Store from "../utils/store.js";
import storage from "../utils/Storage.js";
import { EventBus } from "../utils/pubsub.js";
import * as fileList from "../utils/fileList";

export default {
  name: "Index",
  data: () => ({
    loginName: "",
    passWord: "",
    type: 3
  }),
  created() {
    EventBus.$on("loginsuccess",this.loginsuccess.bind(this));
  },
  methods: {
    loginsuccess() {
      this.$router.push('/about')
    },
    login() {
      axios
        .post("/userLogin/userLoginMode", {
          subscriberPhone: this.loginName,
          passWord: this.passWord,
          type: this.type
        })
        .then(res => {
          let code = res.data.code;
          //reStatus(code);

          if (code === "01") {
            if (Store.firstInit) {
              Store.firstInit = false;
              createConnect();
            } else {
              EventBus.$emit("loginsuccess", {});
            }
          } else if (code === "10004") {
            this.$alert("这是一段内容", "标题名称", {
              confirmButtonText: "确定",
              callback: action => {
                this.$message({
                  type: "info",
                  message: `action: ${action}`
                });
              }
            });
          } else if (code === "02") {
            this.$alert("服务器异常", {
              confirmButtonText: "确定"
            });
          } else if (code === "10002") {
            this.$alert("该用户未注册", {
              confirmButtonText: "确定"
            });
          }
        });
    }
  }
};
</script>


<style>
.logo {
  height: 450px;
}
.logo img {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
}
.form {
  margin: 0 auto;
      display: inline-block;

}
.login {
  margin: 0 0 20px 0;
  height: 40px;
  width: 100%;
}
.login label,
.login input {
  display: inline-block;
  font-size: 30px;
}
.login label {
  width: 80px;
  margin-right: 40px;
  text-align: justify;
  word-spacing: 30px;
}
.login input {
  width: 220px;
  background-color: white;
  padding: 0 !important;
}

.login_other {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.other_btn {
  height: 40px;
  font-size: 20px;
  padding-left: 10px;
}
.login_btn {
  width: 45%;
  margin: 0 auto;
  font-size: 29px;
  background-color: #ff6600;
  color: #fff;
}
</style>

