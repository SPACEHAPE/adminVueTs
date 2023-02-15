<template>
  <div class="buildingList">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 基本信息管理 </el-breadcrumb-item>
        <el-breadcrumb-item> 单元管理 </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-form :model="query" ref="queryForm" class="searchForm">
           <el-form-item prop="buildingId">
            <el-input v-model="query.name" autocomplete="off" placeholder="楼宇" class="query-input mr10"></el-input>
          </el-form-item>
          <el-form-item prop="name">
            <el-input v-model="query.buildingId" autocomplete="off" placeholder="名称" class="query-input mr10"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handlePageChange(1)">搜索</el-button>
            <el-button type="info" plain icon="el-icon-refresh" @click="resetForm">重置</el-button>
            <el-button type="primary" v-if="authButton" icon="el-icon-plus" @click="showDialog">添加</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table stripe border :data="tableData" style="margin-top: 10px">
        <el-table-column v-for="(item, index) in columns" :key="index" :prop="item.prop" :label="item.label" :width="item.width || ''" align="center" v-show="item.istrue">
          <template #default="scope">
            <template v-if="item.prop == 'buildingId'">
              {{ buildingName(scope.row[item.prop]) }}
            </template>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="330" align="center">
          <template #default="scope">
             <el-button class="mr10"  v-if="!authButton" type="primary" size="mini" @click="checkDialog(scope.row)"> 查看</el-button>
            <el-button class="mr10"  v-if="authButton" type="primary" size="mini" @click="showDialog(scope.row)"> 编辑 </el-button>
            <el-button type="danger"  v-if="authButton" size="mini" @click="deletes(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
      </div>
    </div>
    <el-dialog :title="form.id ? '编辑单元' : '新增单元'" v-model="dlShow" width="600px" :before-close="reset">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="楼宇" prop="buildingId">
            <el-input v-model="form.buildingId" placeholder="请输入楼宇" maxlength="20"></el-input>
        </el-form-item>
        <!-- <el-form-item label="类型" prop="building.type">
          <el-select v-model="form.building.type">
            <el-option label="楼梯房" value="楼梯房"></el-option>
            <el-option label="电梯房" value="电梯房"></el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="dlHandle">确 定</el-button>
          <el-button @click="reset">取 消</el-button>
        </div>
      </template>
    </el-dialog>

        <el-dialog title="查看单元楼" v-model="checkShow" width="600px" :before-close="reset">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="名称" prop="name">
          <el-input disabled v-model="form.name" placeholder="请输入名称" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="楼宇" prop="buildingId">
            <el-input disabled v-model="form.buildingId" placeholder="请输入楼宇" maxlength="20"></el-input>
        </el-form-item>
        <!-- <el-form-item label="类型" prop="building.type">
          <el-select v-model="form.building.type">
            <el-option label="楼梯房" value="楼梯房"></el-option>
            <el-option label="电梯房" value="电梯房"></el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
      <template #footer>
        <div class="dialog-footer">
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
import { getBuildingUnitList, buildingDelete, buildingAdd, buildingEdit } from "../../api/buildingUnit";
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
        buildingId: ""
      },
      columns: [
        { prop: "name", label: "楼宇", istrue: true },
        { prop: "buildingId", label: "名称", istrue: true }
      ],
      form: {
        id: 0,
        name: "",
        type: "",
        buildingId: ""
      },
      buildingList: [],
      authButton: sessionStorage.getItem("token") === 'admin'
    });
    const rules = {
      name: [{ required: true, message: "请输入名称", trigger: "blur" }],
      buildingId: [{ required: true, message: "请选择楼宇", trigger: "change" }]
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
      getBuildingUnitList({
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
        buildingDelete(item.id).then(res => {
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
      return id;
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
