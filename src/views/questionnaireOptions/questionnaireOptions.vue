<template>
  <div class="buildingList">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 基本信息管理 </el-breadcrumb-item>
        <el-breadcrumb-item> 问卷信息设置 </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-form :model="query" ref="queryForm" class="searchForm">
          <el-form-item prop="questionnaireId">
            <el-select class="mr10 query-input" v-model="query.questionnaireId" placeholder="请选择问卷">
              <el-option v-for="(item, index) in questionnaireIdList" :key="index" :label="item.name" :value="item.id"></el-option>
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
        <el-table-column header-align="center" align="center" prop="questionnaire.name" label="问卷"> </el-table-column>
        <el-table-column header-align="center" align="center" prop="question" label="问题"> </el-table-column>
        <el-table-column header-align="center" align="center" prop="optionA" label="选项A"> </el-table-column>
        <el-table-column header-align="center" align="center" prop="optionB" label="选项B"> </el-table-column>
        <el-table-column header-align="center" align="center" prop="optionC" label="选项C"> </el-table-column>
        <el-table-column header-align="center" align="center" prop="optionD" label="选项D"> </el-table-column>

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
    <el-dialog :title="form.id ? '编辑问卷问题' : '新增问卷问题'" v-model="dlShow" width="600px" :before-close="reset">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item prop="questionnaireId" label="问卷标题">
          <el-select class="mr10 query-input" v-model="form.questionnaireId" placeholder="请选择问卷">
            <el-option v-for="(item, index) in questionnaireIdList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问题" prop="question">
          <el-input v-model="form.question" placeholder="请输入问题"></el-input>
        </el-form-item>
        <el-form-item label="选项A" prop="optionA">
          <el-input v-model="form.optionA" placeholder="请输入问题"></el-input>
        </el-form-item>
        <el-form-item label="选项B" prop="optionB">
          <el-input v-model="form.optionB" placeholder="请输入问题"></el-input>
        </el-form-item>
        <el-form-item label="选项C" prop="optionC">
          <el-input v-model="form.optionC" placeholder="请输入问题"></el-input>
        </el-form-item>
        <el-form-item label="选项D" prop="optionD">
          <el-input v-model="form.optionD" placeholder="请输入问题"></el-input>
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
import { questionnaireSuggestList } from "../../api/suggest";
import { getQuestionnaireQuestionList, questionnaireQuestionDelete, questionQsAdd, questionQsEdit } from "../../api/question";
import { ElMessage, ElMessageBox } from "element-plus";
export default {
  setup() {
    const { queryForm, pageState, resetForm, handlePageChange } = pageList();
    const addFormObj = addForm({
      questionnaireId: ""
    });
    const { formRef, reset } = addFormObj;
    const state = reactive({
      query: {
        questionnaireId: ""
      },
      columns: [{ prop: "questionnaireId", label: "问卷类型", istrue: true }],
      form: {
        id: 0,
        name: "",
        type: ""
      },
      questionnaireIdList: []
    });
    const rules = {
      questionnaireId: [{ required: true, message: "请选择问卷", trigger: "change" }],
      question: [{ required: true, message: "请输入问题", trigger: "blur" }],
      optionA: [{ required: true, message: "请输入答案", trigger: "blur" }],
      optionB: [{ required: true, message: "请输入答案", trigger: "blur" }],
      optionC: [{ required: true, message: "请输入答案", trigger: "blur" }],
      optionD: [{ required: true, message: "请输入答案", trigger: "blur" }]
    };
    //获取问卷option
    const getbuildingList = () => {
      questionnaireSuggestList().then(res => {
        state.questionnaireIdList = res.data;
      });
    };
    getbuildingList();
    // 获取列表
    const getList = () => {
      getQuestionnaireQuestionList({
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
        questionnaireQuestionDelete(item.id).then(res => {
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
            questionQsEdit(state.form).then(res => {
              ElMessage.success("修改成功");
              reset();
              getList();
            });
          } else {
            questionQsAdd(state.form).then(res => {
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
