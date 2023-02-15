<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">物业后台管理系统</div>
      <el-form :model="param" :rules="rules" ref="loginRef" label-width="0px" class="ms-content">
        <el-form-item prop="loginName">
          <el-input v-model="param.loginName" placeholder="username">
            <template #prepend>
              <el-button icon="el-icon-user"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="password" v-model="param.password" @keyup.enter="submitForm()">
            <template #prepend>
              <el-button icon="el-icon-lock"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm()">登录</el-button>
        </div>
        <p class="login-tips">Tips : 用户名和密码随便填。</p>
      </el-form>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { login } from "../api/user";
export default {
  setup() {
    const Store = useStore();
    const router = useRouter();
    const param = reactive({
      loginName: "admin",
      password: "admin"
    });

    const rules = {
      loginName: [
        {
          required: true,
          message: "请输入用户名",
          trigger: "blur"
        }
      ],
      password: [{ required: true, message: "请输入密码", trigger: "blur" }]
    };
    const loginRef = ref(null);
    const submitForm = () => {
      loginRef.value.validate(valid => {
        if (valid) {
          login(param).then(res => {
            if (res.data.code === 0) {
              sessionStorage.setItem('token',param.loginName)
              ElMessage.success("登录成功");
              router.push({
                path: "/welcome"
              });
            }else{
              ElMessage.error(res.data.message);
            }
          });
        } else {
          ElMessage.error("登录成功");
          return false;
        }
      });
    };

    Store.commit("clearTags");

    return {
      param,
      rules,
      loginRef,
      submitForm
    };
  }
};
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../assets/img/login-bg.jpg);
  background-size: 100%;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #333;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.4);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>
