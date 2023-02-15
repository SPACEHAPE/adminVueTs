<template>
  <div class="buildingList">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i> 社区服务管理
        </el-breadcrumb-item>
        <el-breadcrumb-item> 公告信息管理 </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-form :model="query" ref="queryForm" class="searchForm">
          <el-form-item prop="title">
            <el-input
              v-model="query.title"
              autocomplete="off"
              placeholder="请输入缴费通知"
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
            <el-button
              type="primary"
              v-if="addAuth"
              icon="el-icon-plus"
              @click="showDialog"
              >添加</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <el-table stripe border :data="tableData" style="margin-top: 10px">
        <el-table-column
          header-align="center"
          align="center"
          prop="title"
          label="缴费通知"
        >
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="publisher"
          label="发布人"
        >
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="publishTimeNString"
          label="发布时间"
        >
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="reviser"
          label="修改人"
        >
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="reviseTimeString"
          label="修改时间"
        >
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="reviseTimeString"
          label="图片"
        >
          <template #default="scope">
            <img
              style="height: 100px"
              :src="scope.row.imageUrl"
              @click="imgClick(scope.row.imageUrl)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="330" align="center">
          <template #default="scope">
            <el-button
              class="mr10"
              v-if="!addAuth"
              type="primary"
              size="mini"
              @click="showDialog(scope.row);"
            >
              查看
            </el-button>
            <el-button
              class="mr10"
              v-if="addAuth"
              type="primary"
              size="mini"
              @click="showDialog(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              v-if="addAuth"
              size="mini"
              @click="deletes(scope.row)"
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
      :title="form.id ? '编辑公告信息' : '新增公告信息'"
      v-model="dlShow"
      width="600px"
      :before-close="reset"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="form.title"
            placeholder="请输入标题"
            maxlength="40"
          ></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input
            type="textarea"
            v-model="form.content"
            placeholder="情输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="content">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.imageUrl" style="width: 200px" :src="form.imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="dlHandle">确 定</el-button>
          <el-button @click="reset">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog width="1100px" v-model="imgShow">
      <div class="div">
        <img class="imgUrl" :src="form.imageUrl" />
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { reactive, toRefs, ref } from "vue";
import { parseTime } from "../../utils/index.js";
import pageList from "../../hooks/pageList";
import addForm from "../../hooks/addForm";
import { getBuildingList } from "../../api/buildingList";
import {
  getAnnouncementList,
  announcementDelete,
  buildingEdit,
  buildingAdd,
} from "../../api/community";
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
        title: "",
      },
      form: {
        title: "",
        content: "",
      },
      buildingList: [],
      addAuth: sessionStorage.getItem("token") === "admin",
      imgUrl: "",
      uploadUrl: "http://localhost:80/commonInfo/file/upload",
      imgShow: false,
      imageUrl: "",
    });
    const rules = {
      title: [{ required: true, message: "请输入标题", trigger: "blur" }],
      textarea: [{ required: true, message: "请输入内容", trigger: "blur" }],
    };
    //获取楼宇列表
    const getbuildingList = () => {
      getBuildingList({
        pageNo: 1,
        pageSize: 10000,
      }).then((res) => {
        state.buildingList = res.data.data;
      });
    };
    getbuildingList();
    // 获取列表
    const getList = () => {
      getAnnouncementList({
        pageNo: pageState.pageNo,
        pageSize: pageState.pageSize,
        ...state.query,
      }).then((res) => {
        pageState.tableData = res.data.data;
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
        announcementDelete(item.id).then((res) => {
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
            state.form.ublisher = null;
            state.form.reviser = null;
            state.form.publisher = null;
            state.imgUrl = "";
            state.form.reviseTime = parseTime(state.form.reviseTimeString);
            state.form.publishTimeN = parseTime(state.form.publishTimeNString);
            buildingEdit(state.form).then((res) => {
              ElMessage.success("修改成功");
              reset();
              getList();
            });
          } else {
            let form = state.form;
            form.publisherName = "11";
            buildingAdd(form).then((res) => {
              ElMessage.success("新增成功");
              reset();
              getList();
            });
          }
        }
      });
    };

    const imgClick = (val) => {
      state.imageUrl = val;
      state.imgUrl = val
      state.imgShow = true;
    };

    const handleAvatarSuccess = (response, uploadFile) => {
      state.form.face = response.data;
      state.form.imageUrl = URL.createObjectURL(uploadFile.raw);
    };
    const beforeAvatarUpload = (rawFile) => {
      console.log(rawFile.type);
      if (rawFile.type !== "image/jpeg" && rawFile.type !== "image/png") {
        ElMessage.error("Avatar picture must be JPG  or  PNG format!");
        return false;
      } else if (rawFile.size / 1024 / 1024 > 20) {
        ElMessage.error("Avatar picture size can not exceed 2MB!");
        return false;
      }
      return true;
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
      imgClick,
      handleAvatarSuccess,
      beforeAvatarUpload,
    };
  },
};
</script>
<style lang="scss" scoped>
.div {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .imgUrl {
    max-width: 1000px;
  }
}
</style>
