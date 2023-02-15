<template>
  <div class="buildingList">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 缴费管理 </el-breadcrumb-item>
        <el-breadcrumb-item> 缴费类型管理 </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-form :model="query" ref="queryForm" class="searchForm">
          <el-form-item>
            <el-input v-model="query.name" autocomplete="off" placeholder="名称" class="query-input mr10"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handlePageChange(1)">搜索</el-button>
            <el-button type="info" plain icon="el-icon-refresh" @click="resetForm">重置</el-button>
            <el-button type="primary" icon="el-icon-plus" @click="showDialog">新增</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table stripe border :data="tableData" style="margin-top: 10px">
        <el-table-column header-align="center" align="center" prop="name" label="名称"> </el-table-column>
        <el-table-column header-align="center" align="center" prop="amount" label="金额"> </el-table-column>
        <el-table-column label="操作" width="330" align="center">
          <template #default="scope">
            <el-button class="mr10" type="primary" size="mini" @click="showDialog(scope.row)"> 查看 </el-button>
            <el-button type="danger" size="mini" @click="deletes(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
      </div>
    </div>
    <el-dialog :title="form.id ? '新增缴费信息' : '查看缴费信息'" v-model="dlShow" width="600px" :before-close="reset">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="金额" prop="amount">
          <el-input v-model="form.amount" placeholder="请输入金额" maxlength="20"></el-input>
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
import pageList from "../../hooks/pageList";
import addForm from "../../hooks/addForm";
import { getBuildingList } from "../../api/buildingList";
import { getPaymentList, paymentDelete, buildingEdit, buildingAdd } from "../../api/payment";
import { ElMessage, ElMessageBox } from "element-plus";
export default {
  setup() {
    const { queryForm, pageState, resetForm, handlePageChange } = pageList();
    const addFormObj = addForm({
      name: ""
    });
    const { formRef, reset } = addFormObj;
    const state = reactive({
      query: {
        name: ""
      },
      form: {
        name: "",
        amount: ""
      },
      buildingList: []
    });
    const rules = {
      name: [{ required: true, message: "请输入名称", trigger: "blur" }],
      amount: [{ required: true, message: "请输入金额", trigger: "blur" }]

      // type: [{ required: true, message: '请选择类型', trigger: 'change' }],
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
      getPaymentList({
        pageNo: pageState.pageNo,
        pageSize: pageState.pageSize,
        ...state.query
      }).then(res => {
        pageState.tableData = res.data.data;
        pageState.pageTotal = res.data.recordsTotal;
      });
    };
    //新增和编辑数据
    const dlHandle = () => {
      console.log(formRef, "formRef");
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
    // 删除数据
    const deletes = item => {
      ElMessageBox.confirm("此操作将永久删除该数据, 是否继续?", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        paymentDelete(item.id).then(res => {
          ElMessage.success("删除数据成功");
          getList();
        });
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
<style lang="scss" scoped>
.info_content {
  padding: 20px;
  display: flex;
  align-items: center;

  .name {
    width: 100px;
    font-size: 14px;
    color: #333;
  }
  .content_info {
    color: #a6a4a4;
  }
}
</style>
