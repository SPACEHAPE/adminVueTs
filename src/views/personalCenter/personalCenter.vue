<template>
  <div class="buildingList">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 基本信息管理 </el-breadcrumb-item>
        <el-breadcrumb-item> 个人中心 </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-form :model="userForm" ref="useRef" label-width="100px" :rules="rules">
          <el-form-item label="登录名：" prop="loginName">
            <el-input v-model="userForm.loginName"></el-input>
          </el-form-item>
          <el-form-item label="密码：" prop="password">
            <el-input v-model="userForm.password"></el-input>
          </el-form-item>
          <el-form-item label="姓名：" prop="realname">
            <el-input v-model="userForm.realname"></el-input>
          </el-form-item>
          <el-form-item label="电话：" prop="tel">
            <el-input v-model="userForm.tel"></el-input>
          </el-form-item>
          <el-form-item label="头像：">
            <el-upload class="avatar-uploader" :action="uploadUrl" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
              <!-- <img v-if="imgUrl" :src="'http://markwsz.nat300.top/' + imgUrl" class="avatar" /> -->
              <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
        </el-form>
        <view class="btn_container">
          <el-button type="primary" @click="submit(useRef)">修改</el-button>
        </view>
      </div>
    </div>
  </div>
</template>
<script>
import { reactive, toRefs, ref, onMounted } from "vue";
import { userMsg, submitUser } from "../../api/user";
import { ElMessage, ElMessageBox } from "element-plus";
export default {
  setup() {
    const useRef = ref();
    const state = reactive({
      userForm: {
        loginName: "",
        face: ""
      },
      imgUrl: "",
      uploadUrl: "http://markwsz.nat300.top/api/file/upload"
    });
    onMounted(() => {
      userInfo();
    });
    const userInfo = () => {
      let userId = localStorage.getItem("token") || "";
      userMsg(userId).then(res => {
        state.userForm = res.data;
        state.imgUrl = state.userForm.face;
      });
    };
    const handleAvatarSuccess = (response, uploadFile) => {
      console.log(uploadFile);
      state.userForm.face = response.data;
      state.imgUrl = URL.createObjectURL(uploadFile.raw);
    };

    const beforeAvatarUpload = rawFile => {
      console.log(rawFile.type);
      if (rawFile.type !== "image/jpeg" && rawFile.type !== "image/png") {
        ElMessage.error("Avatar picture must be JPG  or  PNG format!");
        return false;
      } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error("Avatar picture size can not exceed 2MB!");
        return false;
      }
      return true;
    };
    const submit = useRef => {
      let params = state.userForm;
      submitUser(params).then(res => {
        ElMessage.success("修改成功！");
      });
    };
    return {
      ...toRefs(state),
      handleAvatarSuccess,
      beforeAvatarUpload,
      submit
    };
  }
};
</script>
<style lang="scss" scoped>
.btn_container {
  padding: 30px 0;
  display: flex;
  justify-content: flex-end;
}
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
:deep(.el-upload--text) {
  width: auto;
}
</style>
