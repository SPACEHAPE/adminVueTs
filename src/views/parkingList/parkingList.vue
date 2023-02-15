<template>
  <div class="buildingList">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 基本信息管理 </el-breadcrumb-item>
        <el-breadcrumb-item> 车位信息管理 </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-form :model="query" ref="queryForm" class="searchForm">
          <el-form-item prop="holder">
            <el-select class="mr10 query-input" v-model="query.holder" placeholder="请选择使用人" clearable>
              <el-option v-for="(item, index) in suggestList" :key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="name">
            <el-input v-model="query.name" autocomplete="off" placeholder="名称" class="query-input mr10"></el-input>
          </el-form-item>
          <el-form-item prop="status">
            <el-select class="mr10 query-input" v-model="query.status" placeholder="请选择停车状态">
              <el-option label="空闲" value="空闲"></el-option>
              <el-option label="已分配" value="已分配"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handlePageChange(1)">搜索</el-button>
            <el-button type="info" plain icon="el-icon-refresh" @click="resetForm">重置</el-button>
            <el-button type="primary" icon="el-icon-plus" @click="showDialog">添加</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table stripe border :data="tableData" style="margin-top: 10px">
        <el-table-column v-for="(item, index) in columns" :key="index" :prop="item.prop" :label="item.label" :width="item.width || ''" align="center" v-show="item.istrue">
        </el-table-column>
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
    <el-dialog :title="form.id ? '编辑车位信息' : '新增车位信息'" v-model="dlShow" width="600px" :before-close="reset">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入车位名称" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="使用人" prop="holderId">
          <el-input v-model="form.holder" placeholder="请输入车位使用人" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select class="mr10 query-input" v-model="form.status" placeholder="请选择停车状态">
              <el-option label="空闲" value="空闲"></el-option>
              <el-option label="已分配" value="已分配"></el-option>
            </el-select>
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
import { getSuggestList } from "../../api/suggest";
import { getBuildingList } from "../../api/buildingList";
import { getparkingList, pakingDelete, buildingEdit, buildingAdd } from "../../api/parking";
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
        name: "",
        holderId: "",
        status: ""
      },
      columns: [
        { prop: "name", label: "名称", istrue: true },
        { prop: "holder", label: "使用人", istrue: true },
        { prop: "status", label: "车位状态", istrue: true }
      ],
      form: {
        id: 0,
        name: "",
        holderId: ""
      },
      buildingList: [],
      suggestList: []
    });
    const rules = {
      name: [{ required: true, message: "请输入车位名称", trigger: "blur" }],
      type: [{ required: true, message: "请选择类型", trigger: "blur" }],
      status: [{ required: true, message: "请选择类型", trigger: "change" }],
    };
    //获取楼宇列表
    const getbuildingList = () => {
      // getBuildingList({
      //   pageNo: 1,
      //   pageSize: 10
      // }).then(res => {
      //   state.buildingList = res.data.data;
      // });
      // getSuggestList({
      //   pageNo: 1,
      //   pageSize: 10000
      // }).then(res => {
      //   if (res.successful) {
      //     state.suggestList = res.data;
      //   }
      // });
    };
    getbuildingList();
    // 获取列表
    const getList = () => {
      getparkingList({
        pageNo: pageState.pageNo,
        pageSize: pageState.pageSize,
        ...state.query
      }).then(res => {
        console.log(res);
        pageState.tableData = res.data.data;
        const arr = []
        res.data.data.forEach(item => {
          if(!arr.includes(item.holder)) arr.push(item.holder)
        })
        state.suggestList = arr;
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
        pakingDelete(item.id).then(res => {
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
    const buildingName = id => {
      let buildingName = "";
      state.buildingList.forEach(item => {
        if (item.id == id) buildingName = item.name;
      });
      return buildingName;
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
      buildingName
    };
  }
};
</script>
<style lang="scss" scoped></style>
