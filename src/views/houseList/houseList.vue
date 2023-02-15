<template>
  <div class="buildingList">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 基本信息管理 </el-breadcrumb-item>
        <el-breadcrumb-item> 房屋管理 </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-form :model="query" ref="queryForm" class="searchForm">
          <el-form-item prop="building">
            <el-select class="mr10 query-input" v-model="query.building" placeholder="请选择楼宇">
              <el-option v-for="(item, index) in buildingList" :key="index" :label="item.name" :value="item.name"></el-option>
            </el-select>
            <!-- <el-select class="mr10 query-input" v-model="query.suggestId" placeholder="请入住人">
              <el-option v-for="(item, index) in suggestList" :key="index" :label="item.realname" :value="item.id"></el-option>
            </el-select> -->
            
          </el-form-item>
          <el-form-item prop="buildingUnit">
           <el-select class="mr10 query-input" v-model="query.buildingUnit" placeholder="请选择单元">
              <el-option label="一单元" value="一单元">一单元</el-option>
              <el-option label="二单元" value="二单元">二单元</el-option>
              <el-option label="三单元" value="三单元">三单元</el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="checkinUser">
            <el-input v-model="query.checkinUser" autocomplete="off" placeholder="请输入入住人" class="query-input mr10"></el-input>
          </el-form-item>
          <el-form-item prop="name">
            <el-input v-model="query.name" autocomplete="off" placeholder="房屋名称" class="query-input mr10"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handlePageChange(1)">搜索</el-button>
            <el-button type="info" plain icon="el-icon-refresh" @click="resetForm">重置</el-button>
            <el-button type="primary" icon="el-icon-plus" @click="showDialog">添加</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table stripe border :data="tableData" style="margin-top: 10px">
        <el-table-column v-for="(item, index) in columns" :key="index" :prop="item.prop" :label="item.label" :width="item.width || ''" align="center">
          <template #default="scope">
            <template v-if="item.prop == 'checkinUser'">
              <span v-if="scope.row.checkinUser">{{ scope.row.checkinUser }}</span>
            </template>
            <template v-else-if="item.prop == 'buildingUnit'">
              {{ scope.row.buildingUnit }}
            </template>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
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
    <el-dialog :title="form.id ? '编辑房屋' : '新增房屋'" v-model="dlShow" width="600px" :before-close="reset">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="楼宇" prop="building">
         <el-select class="mr10 query-input" v-model="form.building" placeholder="请选择楼宇">
              <el-option v-for="(item, index) in buildingList" :key="index" :label="item.name" :value="item.name"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="单元" prop="buildingUnit">
          <el-select v-model="form.buildingUnit" maxlength="100%">
            <el-option v-for="(item, index) in buildingUnitList" :key="index" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="面积" prop="area">
          <el-input v-model="form.area" placeholder="请输入面积" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="入住人" prop="checkinUser">
          <el-input v-model="form.checkinUser" placeholder="请输入住人" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="入住时间">
          <el-date-picker v-model="form.checkinDate" type="datetime" placeholder="入住时间" format="YYYY/MM/DD" value-format="YYYY-MM-DD hh:mm:ss"></el-date-picker>
        </el-form-item>

        <el-form-item label="用途" prop="purpose">
          <el-input v-model="form.purpose" placeholder="请输入名称" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input v-model="form.tel" placeholder="电话" maxlength="20" type="tel"></el-input>
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
import { parseTime } from "../../utils/index.js";
import addForm from "../../hooks/addForm";
import { getBuildingList } from "../../api/buildingList";
import { getBuildingUnitList } from "../../api/buildingUnit";
import { getSuggestList } from "../../api/suggest";
import { getHouseList, houseDelete, buildingEdit, buildingAdd } from "../../api/houseList";

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
        building: "",
        buildingUnit: "",
        checkinUser:"",
        suggestId: ""
      },
      columns: [
        { prop: "building", label: "楼宇", istrue: true },
        { prop: "buildingUnit", label: "单元", istrue: true },
        { prop: "name", label: "名称", istrue: true },
        { prop: "area", label: "面积", istrue: true },
        // { prop: "status", label: "状态", istrue: true },
        { prop: "checkinUser", label: "入住人", istrue: true },
        { prop: "tel", label: "电话", istrue: true },
        { prop: "checkinDate", label: "入住日期", istrue: true },
        { prop: "purpose", label: "用途", istrue: true }
      ],
      form: {
        id: 0,
        name: "", //名称
        buildingUnit: "", //单元
        checkinDate: "", //入住时间
        checkinUser: "" //入住人
      },
      buildingList: [],
      buildingUnitList: [],
      suggestList: []
    });
    const rules = {
      building: [{ required: true, message: "请选择楼宇", trigger: "change" }],
      buildingUnit: [{ required: true, message: "请选择单元", trigger: "change" }],
      name: [{ required: true, message: "请输入名称", trigger: "blur" }],
      area: [{ required: true, message: "请输入面积", trigger: "blur" }],
      checkinUser: [{ required: true, message: "请选择入住人", trigger: "blur" }],
      purpose: [{ required: true, message: "请输入用途", trigger: "blur" }],
      tel: [{ required: true, message: "请输入电话", trigger: "blur" }]
    };
    //获取房屋列表
    const buildingList = () => {
      getBuildingList({
        pageNo: 1,
        pageSize: 10000
      }).then(res => {
        state.buildingList = res.data.data;
      });
      getBuildingUnitList({
        pageNo: 1,
        pageSize: 10000
      }).then(res => {
        state.buildingUnitList = res.data.data;
      });
      getSuggestList({
        pageNo: 1,
        pageSize: 10000
      }).then(res => {
        state.suggestList = res.data.data;
      });
    };
    buildingList();
    // 获取列表
    const getList = () => {
      getHouseList({
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
        houseDelete(item.id).then(res => {
          ElMessage.success("删除数据成功");
          getList();
        });
      });
    };
    //新增和编辑数据
    const dlHandle = () => {
      formRef.value.validate(valid => {
        if (valid) {
          // state.form.status = "已分配";
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
<style lang="scss" scoped>
.el-select {
  margin-right: 6px;
}
</style>
