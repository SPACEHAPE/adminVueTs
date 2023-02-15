<template>
  <div class="buildingList">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i>社区服务管理 </el-breadcrumb-item>
        <el-breadcrumb-item> 保安执勤管理 </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-form :model="query" ref="queryForm" class="searchForm">
          <el-form-item prop="securityStaffName">
            <el-input v-model="query.securityStaffName" autocomplete="off" placeholder="保安姓名" class="query-input mr10"></el-input>
          </el-form-item>
          <el-form-item prop="company">
            <el-input v-model="query.company" autocomplete="off" placeholder="公司" class="query-input mr10"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handlePageChange(1)">搜索</el-button>
            <el-button type="info" plain icon="el-icon-refresh" @click="resetForm">重置</el-button>
            <el-button type="primary" v-if="authButton" icon="el-icon-plus" @click="showDialog">添加</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table stripe border :data="tableData" style="margin-top: 10px">
        <el-table-column header-align="center" align="center" prop="securityStaffName" label="姓名"> </el-table-column>
        <el-table-column header-align="center" align="center" prop="company" label="公司"> </el-table-column>
        <el-table-column header-align="center" align="center" prop="timeRange" label="值班时段"> </el-table-column>
        <el-table-column label="操作" width="330" align="center" v-if="authButton">
          <template #default="scope" >
            <el-button class="mr10" type="primary" size="mini" @click="showDialog(scope.row)"> 编辑 </el-button>
            <el-button type="danger" size="mini" @click="deletes(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
      </div>
    </div>
    <el-dialog :title="form.id ? '编辑保安人员信息' : '新增保安人员信息'" v-model="dlShow" width="600px" :before-close="reset">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="姓名" prop="securityStaffName">
          <el-input v-model="form.securityStaffName" placeholder="请输入姓名" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="公司" prop="company">
          <el-input v-model="form.company" placeholder="请输入公司名称" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="值班时段" prop="timeRange">
          <el-input v-model="form.timeRange" placeholder="请输入姓名" maxlength="20"></el-input>
        </el-form-item>
        <!-- <el-form-item label="激活" prop="actived">
          <el-switch v-model="form.actived" active-color="#13ce66" inactive-color="#f33f3"></el-switch>
        </el-form-item> -->
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
import pageList from "../../hooks/pageList";
import addForm from "../../hooks/addForm";
import { getBuildingList } from "../../api/buildingList";
import { getSecurityDutyList, securityDutyDelete, buildingEdit, buildingAdd } from "../../api/securityDuty";
import { ElMessage, ElMessageBox } from "element-plus";
export default {
  setup() {
    const { queryForm, pageState, resetForm, handlePageChange } = pageList();
    const addFormObj = addForm({
      name: "",
      type: ""
    });
    const { formRef, reset } = addFormObj;
    const state = reactive({
      query: {
        securityStaffName: "",
        company: ""
      },
      columns: [
        { prop: "buildingId", label: "楼宇", istrue: true },
        { prop: "name", label: "名称", istrue: true }
      ],
      form: {
        id: 0
      },
      buildingList: [],
      authButton: sessionStorage.getItem("token") === 'admin'
    });
    const rules = {
      securityStaffName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
      company: [{ required: true, message: "请输入公司名称", trigger: "blur" }],
      timeRange: [{ required: true, message: "情输入值班时段", trigger: "blur" }]
    };

    //获取楼宇列表
    const getbuildingList = () => {
      getBuildingList({
        pageNo: 1,
        pageSize: 10000
      }).then(res => {
        state.buildingList = res.data.data;
      });
    };
    getbuildingList();
    // 获取列表
    const getList = () => {
      getSecurityDutyList({
        pageNo: pageState.pageNo,
        pageSize: pageState.pageSize,
        ...state.query
      }).then(res => {
        pageState.tableData = res.data.data;
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
        securityDutyDelete(item.id).then(res => {
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
            buildingEdit(state.form).then(res => {
              ElMessage.success("修改成功");
              reset();
              getList();
            });
          } else {
            buildingAdd(state.form).then(res => {
              ElMessage.success("新增成功");
              reset();
              getList();
            });
          }
        }
      });
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
      dlHandle
    };
  }
};
</script>
<style lang="scss" scoped></style>
