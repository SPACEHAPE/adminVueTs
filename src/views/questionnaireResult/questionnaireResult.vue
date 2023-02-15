<template>
  <div class="buildingList">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 问卷调查 </el-breadcrumb-item>
        <el-breadcrumb-item> 问卷结果 </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-form :model="query" ref="queryForm" class="searchForm">
          <el-form-item prop="buildingId">
            <el-select class="mr10 query-input" v-model="query.questionnaireId" placeholder="请选择调查问卷">
              <el-option v-for="(item, index) in buildingList" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handlePageChange(1)">搜索</el-button>
            <el-button type="info" plain icon="el-icon-refresh" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table stripe border :data="tableData" style="margin-top: 10px">
        <el-table-column header-align="center" align="center" prop="questionnaire.name" label="调查问卷"> </el-table-column>
        <el-table-column header-align="center" align="center" prop="question.question" label="问题"> </el-table-column>
        <el-table-column header-align="center" align="center" prop="timeString" label="时间"> </el-table-column>
        <el-table-column header-align="center" align="center" prop="myChosen" label="我的选择"> </el-table-column>
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
    <el-dialog title="查看问卷结果信息" v-model="dlShow" width="600px">
      <div class="info_content">
        <div class="name">调查问卷标题：</div>
        <div class="content_info">{{ form.questionnaire ? form.questionnaire.name : "" }}</div>
      </div>
      <div class="info_content">
        <div class="name">问题：</div>
        <div class="content_info">{{ form.question ? form.question.question : "" }}</div>
      </div>
      <div class="info_content">
        <div class="name">填卷人：</div>
        <div class="content_info">{{ form.user ? form.user.realname : "" }}</div>
      </div>
      <div class="info_content">
        <div class="name">时间：</div>
        <div class="content_info">{{ form.timeString }}</div>
      </div>
      <div class="info_content">
        <div class="name">我的选择：</div>
        <div class="content_info">{{ form.myChosen }}</div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dlShow = false">返回</el-button>
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
import { getQuestionnaireResultList, questionnaireResultDelete } from "../../api/question";
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
        questionnaireId: ""
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
      buildingList: []
    });
    const rules = {
      name: [{ required: true, message: "请输入楼宇名称", trigger: "blur" }]
      // type: [{ required: true, message: '请选择类型', trigger: 'change' }],
    };
    //获取调查问卷option
    const getbuildingList = () => {
      questionnaireSuggestList().then(res => {
        state.buildingList = res.data;
      });
    };
    getbuildingList();
    // 获取列表
    const getList = () => {
      getQuestionnaireResultList({
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
        questionnaireResultDelete(item.id).then(res => {
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
      deletes
    };
  }
};
</script>
<style lang="scss" scoped>
.info_content {
  padding: 10px;
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
