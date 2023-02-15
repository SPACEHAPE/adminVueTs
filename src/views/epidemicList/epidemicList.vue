<template>
  <div class="buildingList">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 疫情防控管理 </el-breadcrumb-item>
        <!-- <el-breadcrumb-item>  </el-breadcrumb-item> -->
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-form :model="query" ref="queryForm" class="searchForm">
          <el-form-item prop="people">
            <el-input v-model="query.people" autocomplete="off" placeholder="人员" class="query-input mr10"></el-input>
          </el-form-item>
          <el-form-item prop="healthCodeColor">
            <el-select class="mr10 query-input" v-model="query.healthCodeColor" placeholder="请选择健康码">
              <el-option label="所有" value=""></el-option>
              <el-option label="绿" value="绿"></el-option>
              <el-option label="黄" value="黄"></el-option>
              <el-option label="红" value="红"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="otherCityReturn">
            <el-select class="mr10 query-input" v-model="query.otherCityReturn" placeholder="请选择是否外地返回">
              <el-option label="所有" value=""></el-option>
              <el-option label="是" value="true"></el-option>
              <el-option label="否" value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="returnCity">
            <el-input v-model="query.returnCity" autocomplete="off" placeholder="返回地" class="query-input mr10"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handlePageChange(1)">搜索</el-button>
            <el-button type="info" plain icon="el-icon-refresh" @click="resetForm">重置</el-button>
            <el-button type="primary" icon="el-icon-plus" @click="showDialog">添加</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table stripe border :data="tableData" style="margin-top: 10px" id="selectTable">
        <el-table-column header-align="center" align="center" prop="people" label="人员"> </el-table-column>
        <el-table-column header-align="center" align="center" prop="address" label="住所"> </el-table-column>
        <el-table-column header-align="center" align="center" prop="healthCodeColor" label="健康码"> </el-table-column>
        <el-table-column header-align="center" align="center" prop="otherCityReturnString" label="是否外地返回"> </el-table-column>
        <el-table-column header-align="center" align="center" prop="returnCity" label="返回地"> </el-table-column>
        <el-table-column header-align="center" align="center" prop="temperature" label="体温"> </el-table-column>
        <el-table-column header-align="center" align="center" prop="realname" label="登记人">
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="registerTimeNString" label="登记时间"> </el-table-column>
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
    <el-dialog :title="form.id ? '编辑防疫记录信息' : '新增防疫记录信息'" v-model="dlShow" width="600px" :before-close="reset">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="人员" prop="people">
          <el-input v-model="form.people" placeholder="请输入名称" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="住所" prop="address">
          <el-input v-model="form.address" placeholder="请输入住所地址" maxlength="40"></el-input>
        </el-form-item>
        <el-form-item prop="healthCodeColor">
          <el-select class="mr10 query-input" v-model="form.healthCodeColor" placeholder="请选择健康码">
            <el-option label="所有" value=""></el-option>
            <el-option label="绿" value="绿"></el-option>
            <el-option label="黄" value="黄"></el-option>
            <el-option label="红" value="红"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="返回地" prop="returnCity">
          <el-input v-model="form.returnCity" placeholder="请输入名称" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="体温" prop="temperature">
          <el-input v-model="form.temperature" placeholder="请输入名称" maxlength="20"></el-input>
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
import { useStore } from "vuex";
import { htmlToExcel } from "../../utils/index.js";
import pageList from "../../hooks/pageList";
import addForm from "../../hooks/addForm";
import { getBuildingList } from "../../api/buildingList";
import { getAntiepidemicLogList, antiepidemicLogDelete, buildingEdit, buildingAdd } from "../../api/antiepidemicLog";
import { ElMessage, ElMessageBox } from "element-plus";
export default {
  setup() {
    const { queryForm, pageState, resetForm, handlePageChange } = pageList();
    const addFormObj = addForm({
      people: "",
      healthCodeColor: "",
      otherCityReturn: "",
      returnCity: ""
    });
    const Store = useStore();
    const { formRef, reset } = addFormObj;
    const state = reactive({
      query: {
        people: "",
        healthCodeColor: "",
        otherCityReturn: "",
        returnCity: ""
      },
      form: {
        id: 0,
        name: "",
        type: ""
      },
      buildingList: []
    });
    const rules = {
      people: [{ required: true, message: "请输入姓名", trigger: "blur" }],
      address: [{ required: true, message: "请输入住所地址", trigger: "blur" }],
      returnCity: [{ required: true, message: "请输入返回地", trigger: "blur" }],
      temperature: [{ required: true, message: "请输入体温", trigger: "blur" }],
      healthCodeColor: [{ required: true, message: "请选择健康码状态", trigger: "change" }]
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
      getAntiepidemicLogList({
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
        antiepidemicLogDelete(item.id).then(res => {
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
            if (state.form.returnCity != "") {
              state.form.otherCityReturn = true;
            } else {
              state.form.otherCityReturn = false;
            }
            state.form.deleted = false;
            state.form.extraData = null;
            state.form.id = Store.state.userInfo.id;
            state.form.register.realname = Store.state.userInfo.name;
            buildingAdd(state.form).then(res => {
              ElMessage.success("新增成功");
              reset();
              getList();
            });
          }
        }
      });
    };
    const excelExport = () => {
      htmlToExcel.getExcel("#selectTable", "疫情防控数据" + new Date().getTime());
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
      excelExport
    };
  }
};
</script>
<style lang="scss" scoped></style>
