<template>
  <div class="buildingList">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 社区服务管理 </el-breadcrumb-item>
        <el-breadcrumb-item> 投诉信息管理 </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-form :model="query" ref="queryForm" class="searchForm">
          <el-form-item prop="title">
            <el-input v-model="query.title" autocomplete="off" placeholder="标题" class="query-input mr10"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handlePageChange(1)">搜索</el-button>
            <el-button type="info" plain icon="el-icon-refresh" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table stripe border :data="tableData" style="margin-top: 10px">
        <el-table-column header-align="center" align="center" prop="reporter" label="上报人"> </el-table-column>
        <el-table-column header-align="center" align="center" prop="title" label="标题"> </el-table-column>
        <el-table-column header-align="center" align="center" prop="timeString" label="时间"> </el-table-column>
        <el-table-column header-align="center" align="center" prop="address" label="住址"> </el-table-column>
        <el-table-column header-align="center" align="center" prop="status" label="状态"> </el-table-column>
        <el-table-column header-align="center" align="center" prop="handler" label="处理人">
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="handleTimeString" label="处理时间"> </el-table-column>
        <el-table-column label="操作" width="330" align="center">
          <template #default="scope">
            <el-button class="mr10" type="primary" size="mini" @click="showDialog(scope.row)"> 编辑 </el-button>
            <el-button type="primary" size="mini" @click="handerFun(scope.row)">处理</el-button>
            <el-button type="danger" size="mini" @click="deletes(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
      </div>
    </div>
    <el-dialog title="查看报修信息" v-model="dlShow" width="600px">
      <div class="info_content">
        <div class="name">上报人：</div>
        <div class="content_info">{{ form.reporter }}</div>
      </div>
      <div class="info_content">
        <div class="name">标题：</div>
        <div class="content_info">{{ form.title }}</div>
      </div>
      <div class="info_content">
        <div class="name">时间：</div>
        <div class="content_info">{{ form.timeString }}</div>
      </div>
      <div class="info_content">
        <div class="name">住址：</div>
        <div class="content_info">{{ form.raddress }}</div>
      </div>
      <div class="info_content">
        <div class="name">状态：</div>
        <div class="content_info">{{ form.status }}</div>
      </div>
      <div class="info_content">
        <div class="name">处理人：</div>
        <div class="content_info">{{ form.handler ? form.handler.realname : "" }}</div>
      </div>
      <div class="info_content">
        <div class="name">处理结果：</div>
        <div class="content_info">{{ form.handleFeedback }}</div>
      </div>
      <div class="info_content">
        <div class="name">处理时间：</div>
        <div class="content_info">{{ form.handleTimeString }}</div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dlShow = false">返回</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogVisible" title="处理报修信息" width="600px" draggable>
      <div class="info_content">
        <div class="name">上报人：</div>
        <div class="content_info">{{ form.reporter }}</div>
      </div>
      <div class="info_content">
        <div class="name">标题：</div>
        <div class="content_info">{{ form.title }}</div>
      </div>
      <div class="info_content">
        <div class="name">时间：</div>
        <div class="content_info">{{ form.timeString }}</div>
      </div>
      <div class="info_content">
        <div class="name">住址：</div>
        <div class="content_info">{{ form.raddress }}</div>
      </div>
      <div class="info_content">
        <div class="name">状态：</div>
        <div class="content_info">{{ form.status }}</div>
      </div>
      <div class="info_content">
        <div class="name">处理结果：</div>
        <div class="content_info"><el-input v-model="form.handleFeedback" type="text"></el-input></div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitHander">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { reactive, toRefs, ref } from "vue";
import { parseTime } from "../../utils/index.js";
import pageList from "../../hooks/pageList";
import addForm from "../../hooks/addForm";
import { getBuildingList } from "../../api/buildingList";
import { getComplaintList, complaintDelete, complaintHander } from "../../api/complaint";
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
      dialogVisible: false,
      query: {
        title: ""
      },
      columns: [
        { prop: "buildingId", label: "楼宇", istrue: true },
        { prop: "name", label: "名称", istrue: true }
      ],
      form: {
        id: 0,
        name: "",
        type: "",
        handleFeedback: ""
      },
      buildingList: []
    });
    const rules = {
      name: [{ required: true, message: "请输入楼宇名称", trigger: "blur" }]
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
      getComplaintList({
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
        complaintDelete(item.id).then(res => {
          ElMessage.success("删除数据成功");
          getList();
        });
      });
    };
    // 处理结果
    const handerFun = item => {
      state.dialogVisible = true;
      state.form = item;
      state.form.status = "已处理";
      state.form.time = parseTime(state.form.timeString);
    };
    const submitHander = () => {
      complaintHander(state.form).then(res => {
        ElMessage.success("已处理！");
        state.dialogVisible = false;
        getList();
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
      handerFun,
      submitHander,
      deletes
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
