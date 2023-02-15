<template>
  <div class="buildingList">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 社区服务管理 </el-breadcrumb-item>
        <el-breadcrumb-item> 宠物信息管理 </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-form :model="query" ref="queryForm" class="searchForm">
          <el-form-item prop="owner">
            <el-input v-model="query.owner" autocomplete="off" placeholder="请输入主人" class="query-input mr10"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handlePageChange(1)">搜索</el-button>
            <el-button type="info" plain icon="el-icon-refresh" @click="resetForm">重置</el-button>
            <el-button type="primary" icon="el-icon-plus" @click="showDialog">添加宠物</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table stripe border :data="tableData" style="margin-top: 10px">
        <el-table-column header-align="center" align="center" prop="owner" label="主人"> </el-table-column>
        <el-table-column header-align="center" align="center" prop="registerDateTString" label="登记日期"> </el-table-column>
        <el-table-column header-align="center" align="center" prop="type" label="类型"> </el-table-column>
        <el-table-column header-align="center" align="center" prop="name" label="名称"> </el-table-column>
        <el-table-column header-align="center" align="center" prop="age" label="年龄"> </el-table-column>
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
    <el-dialog :title="form.id ? '修改宠物信息' : '新增宠物信息'" v-model="dlShow" width="600px" :before-close="reset">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="类型：" prop="type">
          <el-input v-model="form.type" placeholder="请输入类型" maxlength="40"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="content">
          <el-input v-model="form.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="content">
          <el-input v-model="form.age" placeholder="请输入年龄"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="dlHandle">确 定</el-button>
          <el-button @click="reset">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- <el-dialog title="查看宠物信息" v-model="dlShow" width="600px">
      <div class="info_content">
        <div class="name">主人：</div>
        <div class="content_info">{{ form.owner ? form.owner.realname : "" }}</div>
      </div>
      <div class="info_content">
        <div class="name">登记日期：</div>
        <div class="content_info">{{ form.registerDateTString }}</div>
      </div>
      <div class="info_content">
        <div class="name">类型：</div>
        <div class="content_info">{{ form.type }}</div>
      </div>
      <div class="info_content">
        <div class="name">名称：</div>
        <div class="content_info">{{ form.displayTitle }}</div>
      </div>
      <div class="info_content">
        <div class="name">年龄：</div>
        <div class="content_info">{{ form.age }}</div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dlShow = false">返回</el-button>
        </div>
      </template>
    </el-dialog> -->
  </div>
</template>
<script>
import { reactive, toRefs, ref } from "vue";
import pageList from "../../hooks/pageList";
import addForm from "../../hooks/addForm";
import { getBuildingList } from "../../api/buildingList";
import { getPetList, petDelete, petAdd, petChange } from "../../api/pet";
import { getSuggestList } from "../../api/suggest";
import { ElMessage, ElMessageBox } from "element-plus";
export default {
  setup() {
    const { queryForm, pageState, resetForm, handlePageChange } = pageList();
    const addFormObj = addForm({
      type: "",
      ownerId: ""
    });
    const { formRef, reset } = addFormObj;
    const state = reactive({
      query: {
        owner: "",
      },
      columns: [
        { prop: "buildingId", label: "楼宇", istrue: true },
        { prop: "name", label: "名称", istrue: true }
      ],
      form: {
        id: 0,
        name: "",
        type: ""
      },
      userSuggesList: []
    });
    const rules = {
      name: [{ required: true, message: "请输入楼宇名称", trigger: "blur" }]
      // type: [{ required: true, message: '请选择类型', trigger: 'change' }],
    };
    //获取楼宇列表
    const getbuildingList = () => {
      getSuggestList({
        pageNo: 1,
        pageSize: 10000
      }).then(res => {
        state.userSuggesList = res.data.data;
      });
    };
    getbuildingList();
    // 获取列表
    const getList = () => {
      getPetList({
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
      formRef.value.validate(valid => {
        if (valid) {
          if (state.form.id) {
            petChange(state.form).then(res => {
              ElMessage.success("修改成功");
              reset();
              getList();
            });
          } else {
            let form = state.form;
            petAdd(form).then(res => { 
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
        petDelete(item.id).then(res => {
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
