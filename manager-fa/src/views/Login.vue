<template>
  <div class="login-container" @keyup.enter="handleSubmit">
    <div class="login-modal">
      <el-form ref="userForm" :model="loginForm" :rules="rules" status-icon>
        <h3 class="login-title">后台管理登录</h3>
        <el-form-item prop="userName">
          <el-input v-model="loginForm.userName" prefix-icon="user" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item prop="userPwd">
          <el-input type="password" v-model="loginForm.userPwd" prefix-icon="view" placeholder="请输入密码" />
        </el-form-item>
      </el-form>
      <el-form-item>
        <el-button type="primary" class="btn" @click="handleSubmit">登录</el-button>
      </el-form-item>

    </div>
  </div>
</template>

<script>
import Api from "@/api/index";
import { syncLoadRoutes } from '../router/index.js'
export default {
  name: "Login",
  data() {
    return {
      loginForm: {

        userName: "dasi22",
        userPwd: "123456",
      },
      rules: {
        userName: [
          {
            required: true,
            trgger: "blur",
            message: "请输入用户名称",
          },
          {
            min: 2,
            max: 10,
            message: "用户长度为2-10",
          },
        ],
        userPwd: [
          {
            required: true,
            trgger: "blur",
            message: "请输入密码",
          },
          {
            min: 2,
            max: 18,
            message: "密码长度为6-18",
          },
        ],
      },
    };
  },

  methods: {
    handleSubmit() {
      this.$refs.userForm.validate(async (valid) => {
        if (valid) {
          try {
            const userInfo = await this.$api.login({ data: this.loginForm })
            this.$router.push("/");
            this.$message.success('登录成功')
            this.$store.commit('saveUserInfo', userInfo)
            await syncLoadRoutes()
          } catch (error) {
            this.$message.error('网络走丢了')
          }
        }
      });
    },
  },
};
</script>

<style lang='scss' scoped>
.login-container {
  position: relative;

  .login-modal {
    position: absolute;
    top: 200px;
    left: 50%;
    padding: 50px;
    transform: translateX(-50%);
    width: 500px;
    height: 250px;
    background-color: #f9fcff;
    box-shadow: 1px 2px 3px 5px #c7c9cb4d;
    border-radius: 5px;

    .login-title {
      font-size: 22px;
      padding-bottom: 20px;
    }

    .btn {
      width: 100%;
    }
  }
}
</style>