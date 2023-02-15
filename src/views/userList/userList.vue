<template>
  <div class="buildingList">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 用户管理 </el-breadcrumb-item>
        <!-- <el-breadcrumb-item> 用户管理 </el-breadcrumb-item> -->
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-form :model="query" ref="queryForm" class="searchForm">
          <el-form-item prop="loginName">
            <el-input v-model="query.loginName" autocomplete="off" placeholder="用户名" class="query-input mr10"></el-input>
          </el-form-item>
          <el-form-item prop="realname">
            <el-input v-model="query.realname" autocomplete="off" placeholder="姓名" class="query-input mr10"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handlePageChange(1)">搜索</el-button>
            <el-button type="info" plain icon="el-icon-refresh" @click="resetForm">重置</el-button>
            <el-button type="primary" icon="el-icon-plus" @click="showDialog">添加</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table stripe border :data="tableData" style="margin-top: 10px" id="selectTable">
        <el-table-column header-align="center" align="center" prop="loginName" label="用户名"> </el-table-column>
        <el-table-column header-align="center" align="center" prop="realname" label="姓名"> </el-table-column>
        <el-table-column header-align="center" align="center" prop="tel" label="电话"> </el-table-column>
        <el-table-column label="操作" width="330" align="center">
          <template #default="scope">
            <el-button class="mr10" type="primary" size="mini" @click="showDialog(scope.row)"> 编辑 </el-button>
            <el-button type="danger" size="mini" @click="deletes(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
      </div>
    </div>
    <el-dialog :title="form.id ? '编辑用户信息' : '新增用户信息'" v-model="dlShow" width="600px" :before-close="reset">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="登录名：" prop="loginName">
          <el-input v-model="form.loginName"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="姓名：" prop="realname">
          <el-input v-model="form.realname"></el-input>
        </el-form-item>
        <el-form-item label="电话：" prop="tel">
          <el-input v-model="form.tel"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="dlHandle">确 定</el-button>
          <el-button @click="reset">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { reactive, toRefs, ref } from "vue";
import { htmlToExcel } from "../../utils/index.js";
import { parseTime } from "../../utils/index.js";
import pageList from "../../hooks/pageList";
import addForm from "../../hooks/addForm";
import { getUserList, userDelete, userAdd, submitUser } from "../../api/user";
import { ElMessage, ElMessageBox } from "element-plus";
export default {
  setup() {
    const { queryForm, pageState, resetForm, handlePageChange } = pageList();
    const addFormObj = addForm({
      loginName: "",
      realname: ""
    });
    const { formRef, reset } = addFormObj;
    const state = reactive({
      query: {
        loginName: "",
        realname: ""
      },
      uploadUrl: "http://markwsz.nat300.top/api/file/upload",
      form: {
        id: "0",
        face: ""
      },
      buildingList: []
    });
    const rules = {
      loginName: [{ required: true, message: "请输入登录名", trigger: "blur" }],
      password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      realname: [{ required: true, message: "请输入姓名", trigger: "blur" }],
      tel: [{ required: true, message: "请输入电话", trigger: "blur" }]

      // type: [{ required: true, message: '请选择类型', trigger: 'change' }],
    };
    // 获取列表
    const getList = () => {
      getUserList({
        pageNo: pageState.pageNo,
        pageSize: pageState.pageSize,
        ...state.query
      }).then(res => {
        let list = res.data.data;
        let list2 = list.filter(f => !f.realname.includes("管理员"));
        pageState.tableData = list2;
        pageState.pageTotal = res.data.recordsTotal;
      });
    };
    // 删除数据
    const deletes = item => {
      ElMessageBox.confirm("此操作将永久删除该数据, 是否继续?", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        userDelete(item.id).then(res => {
          ElMessage.success("删除数据成功");
          getList();
        });
      });
    };
    //新增和编辑数据
    const dlHandle = () => {
      formRef.value.validate(valid => {
        if (valid) {
          if (state.form.id) {
            let data = state.form;
            data.house = null;
            data.parkingLot = null;
            data.checkinDate = parseTime(data.checkinDateString);
            submitUser(data).then(res => {
              ElMessage.success("修改成功");
              reset();
              getList();
            });
          } else {
            userAdd(state.form).then(res => {
              if(res.data.code === -1){
                ElMessage.error(res.data.message);
              } else {
                 ElMessage.success("新增成功");
                  reset();
                  getList();
              }

            });
          }
        }
      });
    };
    const handleAvatarSuccess = (response, uploadFile) => {
      console.log(uploadFile);
      state.form.face = response.data;
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
    const excelExport = () => {
      htmlToExcel.getExcel("#selectTable", "用户数据" + new Date().getTime());
    };
    return {
      ...toRefs(state),
      ...toRefs(pageState),
      ...addFormObj,
      queryForm,
      rules,
      getList,
      resetForm,
      handlePageChange,
      deletes,
      dlHandle,
      handleAvatarSuccess,
      beforeAvatarUpload,
      excelExport
    };
  }
};
</script>
<style lang="scss" scoped>
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
.avatar {
  width: 100%;
}
:deep(.el-upload--text) {
  width: 178px;
}
</style>
