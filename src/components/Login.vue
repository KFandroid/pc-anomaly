<template>
    <div class="" id="">
      <P>{{data}}</P>
      <div class="logo">
        <img src="../assets/icon.jpg" alt="" height="450px" width="450px">
      </div>
      <div class="form">
        <div class="login ">
          <label for="name" >账号</label>
          <input id="name" type="text" autofocus>
        </div>
        <div class="login ">
          <label  for="password">密码</label>
          <input id="password" type="password">
        </div>
        <div class="login login_other">
           <div class="other_btn">注册</div>
           <div class="other_btn">忘记密码</div>
        </div>
        <div class="login_btn">登录</div>
      </div>
    </div>
    
</template>


<script>
export default {
  name: "Index",
  data:{
    data:'saasa'
  }
};
</script>


<style>
  .logo{
    height: 450px;
  }
  .logo img{
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
  .form{
    width: 30%;
    margin: 0 auto;
    padding: 0 40px 40px 40px;
  }
  .login{
    margin: 0 0 20px 0;
    height: 40px;
    width: 100%;
  }
  .login label,.login input{
    display: inline-block;
    font-size: 30px;
  }
  .login label{
    
    width: 80px;
    margin-right: 40px;
    text-align: justify;
    word-spacing: 30px;
    
  }
  .login input{
    width: 220px;
    background-color:white;
    padding: 0 !important;
  }

  .login_other{
    display:flex;
    flex-direction:row;
  justify-content:flex-end;
  }
  .other_btn{
    height: 40px;
    font-size:20px;
    padding-left:10px; 
  }
  .login_btn{
    width: 45%;
    margin: 0 auto;
    font-size: 29px;
    background-color: #ff6600;
    color: #fff;
  }
</style>

