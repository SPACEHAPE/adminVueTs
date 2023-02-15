<template>
  <div class="buildingList">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i> 基本信息管理
        </el-breadcrumb-item>
        <el-breadcrumb-item> 业主信息管理 </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-form :model="query" ref="queryForm" class="searchForm">
          <el-form-item prop="realname">
            <el-input
              v-model="query.realname"
              autocomplete="off"
              placeholder="姓名"
              class="query-input mr10"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="handlePageChange(1)"
              >搜索</el-button
            >
            <el-button
              type="info"
              plain
              icon="el-icon-refresh"
              @click="resetForm"
              >重置</el-button
            >
            <el-button type="primary" icon="el-icon-plus" @click="showDialog"
              >添加</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <el-table
        stripe
        border
        :data="tableData"
        style="margin-top: 10px"
        id="selectTable"
      >
        <el-table-column
          v-for="(item, index) in columns"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width || ''"
          align="center"
          v-show="item.istrue"
        >
        </el-table-column>
        <el-table-column label="操作" width="330" align="center">
          <template #default="scope">
            <el-button
              class="mr10"
              type="primary"
              size="mini"
              @click="showDialog(scope.row)"
            >
              编辑
            </el-button>

            <el-button type="danger" size="mini" @click="deletes(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :total="pageTotal"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>
    <el-dialog
      :title="form.id ? '编辑业主信息' : '新增业主信息'"
      v-model="dlShow"
      width="600px"
      :before-close="reset"
      :opened="opendialog"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="用户名" prop="userName">
          <el-input
            v-model="form.userName"
            placeholder="请输入用户名"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="realname">
          <el-input
            v-model="form.realname"
            placeholder="请输入姓名"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="头像：">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imgUrl" :src="imgUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item> -->
        <el-form-item label="性别" prop="gender">
          <el-select v-model="form.gender">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input
            v-model="form.tel"
            placeholder="请输入电话"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item label="企业" prop="company">
          <el-input
            v-model="form.company"
            placeholder="请输入企业名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="入住日期" prop="checkinDateString">
          <el-date-picker
            v-model="form.checkinDateString"
            type="datetime"
            placeholder="请选择日期"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD hh:mm:ss"
          />
        </el-form-item>
        <el-form-item label="停车位" prop="parkingLot">
          <el-input
            v-model="form.parkingLot"
            placeholder="请输入停车位"
          ></el-input>
        </el-form-item>
        <el-form-item label="房屋" prop="house">
          <el-input v-model="form.house" placeholder="请输入房屋"></el-input>
          <!-- <el-select class="mr10 query-input" v-model="form.houseId" placeholder="请选择房屋">
            <el-option v-for="(item, index) in houseSuggestList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select> -->
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
import { htmlToExcel } from "../../utils/index.js";
import { reactive, toRefs, ref } from "vue";
import pageList from "../../hooks/pageList";
import addForm from "../../hooks/addForm";
import { parseTime } from "../../utils/index.js";
import { getHouseSuggestList, getparkingSuggestList } from "../../api/suggest";
import {
  getWonerInfo,
  wonerDelete,
  wonerEdit,
  wonerAdd,
} from "../../api/woner";
import { ElMessage, ElMessageBox } from "element-plus";
export default {
  setup() {
    const { queryForm, pageState, resetForm, handlePageChange } = pageList();
    const addFormObj = addForm({
      name: "",
      type: "",
    });
    const { formRef, reset } = addFormObj;
    const state = reactive({
      query: {
        realname: "",
      },
      columns: [
        { prop: "userName", label: "用户名", istrue: true },
        { prop: "realname", label: "姓名", istrue: true },
        { prop: "gender", label: "性别", istrue: true },
        { prop: "tel", label: "电话", istrue: true },
        { prop: "company", label: "工作地点", istrue: true },
        { prop: "checkinDateString", label: "入住时间", istrue: true },
        { prop: "house", label: "房屋编号", istrue: true },
        { prop: "parkingLot", label: "车位编号", istrue: true },
      ],
      form: {
        id: 0,
        userName: "",
        password: "",
        realname: "",
        face: "",
        gender: "",
        tel: "",
        company: "",
        checkinDate: "",
        parkingLot: "",
        house: "",
      },
      houseSuggestList: [],
      parkingSuggestList: [],
      imgUrl: "",
      uploadUrl: "http://markwsz.nat300.top/api/file/upload",
    });
    const rules = {
      userName: [{ required: true, message: "请输入登录名", trigger: "blur" }],
      password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      realname: [{ required: true, message: "请输入姓名", trigger: "blur" }],
      gender: [{ required: true, message: "请选择性别", trigger: "change" }],
      tel: [{ required: true, message: "请输入电话", trigger: "blur" }],
      company: [{ required: true, message: "请输入企业名称", trigger: "blur" }],
      parkingLot: [
        { required: true, message: "请选择停车位", trigger: "blur" },
      ],
      house: [{ required: true, message: "请选择房屋", trigger: "blur" }],
    };
    //获取楼宇列表
    const getbuildingList = () => {
      getHouseSuggestList({
        pageNo: 1,
        pageSize: 10,
      }).then((res) => {
        state.houseSuggestList = res.data.data;
      });
      getparkingSuggestList({
        pageNo: 1,
        pageSize: 10,
      }).then((res) => {
        state.parkingSuggestList = res.data;
      });
    };
    getbuildingList();
    // 获取列表
    const getList = () => {
      getWonerInfo({
        pageNo: pageState.pageNo,
        pageSize: pageState.pageSize,
        ...state.query,
      }).then((res) => {
        let list = res.data.data;
        let list2 = list.filter((f) => !f.realname.includes("管理员"));
        pageState.tableData = list2;
        pageState.pageTotal = res.data.recordsTotal;
      });
    };
    // 删除数据
    const deletes = (item) => {
      ElMessageBox.confirm("此操作将永久删除该数据, 是否继续?", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        wonerDelete(item.id).then((res) => {
          ElMessage.success("删除数据成功");
          getList();
        });
      });
    };
    //新增和编辑数据
    const dlHandle = () => {
      formRef.value.validate((valid) => {
        if (valid) {
          if (state.form.id) {
            // state.checkinDateString = state.checkinDate
            wonerEdit(state.form).then((res) => {
              ElMessage.success("修改成功");
              reset();
              getList();
            });
          } else {
            wonerAdd(state.form).then((res) => {
              ElMessage.success("新增成功");
              reset();
              getList();
            });
          }
        }
      });
    };
    const handleAvatarSuccess = (response, uploadFile) => {
      console.log(uploadFile);
      state.form.face = response.data;
      state.imgUrl = URL.createObjectURL(uploadFile.raw);
    };

    const beforeAvatarUpload = (rawFile) => {
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
    const opendialog = () => {
      state.imgUrl = state.form.face;
    };
    const excelExport = () => {
      htmlToExcel.getExcel("#selectTable", "业主数据" + new Date().getTime());
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
      opendialog,
      excelExport,
    };
  },
};
</script>
<style lang="scss" scoped>
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
  width: 178px;
}
</style>
