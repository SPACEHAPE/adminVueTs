<template>
  <div class="buildingList">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 社区服务管理 </el-breadcrumb-item>
        <el-breadcrumb-item>报修投诉信息管理 </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-form :model="query" ref="queryForm" class="searchForm">
          <el-form-item prop="reporter">
            <el-input v-model="query.reporter" autocomplete="off" placeholder="名称" class="query-input mr10"></el-input>
          </el-form-item>
           <el-form-item prop="type">
            <el-select class="mr10 query-input" v-model="query.type" placeholder="请选择类型">
              <el-option label="报修" value="报修">报修</el-option>
              <el-option label="投诉" value="投诉">投诉</el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handlePageChange(1)">搜索</el-button>
            <el-button type="info" plain icon="el-icon-refresh" @click="resetForm">重置</el-button>
            <el-button type="primary" v-if="!authButton"  icon="el-icon-plus" @click="showDialog">新增</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table stripe border :data="tableData" style="margin-top: 10px">
        <el-table-column header-align="center" align="center" prop="reporter" label="上报人"> </el-table-column>
        <el-table-column header-align="center" align="center" prop="detail" label="问题描述"> </el-table-column>
        <el-table-column header-align="center" align="center" prop="timeString" label="保修时间"> </el-table-column>
        <el-table-column header-align="center" align="center" prop="address" label="住址"> </el-table-column>
        <el-table-column header-align="center" align="center" prop="status" label="状态"> </el-table-column>
        <el-table-column header-align="center" align="center" prop="content" label="报修内容"></el-table-column>
        <el-table-column header-align="center" align="center" prop="type" label="类型"></el-table-column>
        <el-table-column header-align="center" align="center" prop="handleTimeString" label="处理时间"> </el-table-column>
        <el-table-column label="操作" width="330" align="center">
          <template #default="scope">
             <el-button class="mr10" v-if="authButton" type="primary" size="mini" @click="checkDialog(scope.row)"> 查看 </el-button>
            <el-button class="mr10" v-if="!authButton" type="primary" size="mini" @click="showDialog(scope.row)"> 编辑 </el-button>
            <el-button type="primary" v-if="authButton && scope.row.status === '未修复'" size="mini" @click="handle(scope.row)">处理</el-button>
            <el-button type="danger" v-if="!authButton || scope.row.status === '已修复'" size="mini" @click="deletes(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
      </div>
    </div>
     <el-dialog :title="form.id ? '编辑报修投诉信息' : '新增报修投诉信息'" v-model="dlShow" width="600px" :before-close="reset">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="住址：" prop="address">
          <el-input v-model="form.address" placeholder="请输入住址" maxlength="40"></el-input>
        </el-form-item>
        <el-form-item label="问题描述" prop="content">
          <el-input type="textarea" v-model="form.detail" placeholder="请输入问题描述"></el-input>
        </el-form-item>
        <el-form-item label="问题描述" prop="type">
          <el-select class="mr10 query-input" v-model="form.type" placeholder="请选择类型">
              <el-option label="报修" value="报修">报修</el-option>
              <el-option label="投诉" value="投诉">投诉</el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="报修内容" prop="content">
          <el-input type="textarea" v-model="form.content" placeholder="请输入报修内容"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="dlHandle">确 定</el-button>
          <el-button @click="reset">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog title="查看" v-model="checkShow" width="600px" :before-close="reset">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="住址：" prop="address">
          <el-input disabled v-model="form.address" placeholder="请输入住址" maxlength="40"></el-input>
        </el-form-item>
        <el-form-item label="问题描述" prop="content">
          <el-input disabled type="textarea" v-model="form.detail" placeholder="请输入问题描述"></el-input>
        </el-form-item>
        <el-form-item label="报修内容" prop="content">
          <el-input disabled type="textarea" v-model="form.content" placeholder="请输入报修内容"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="reset">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- <el-dialog title="查看报修投诉信息" v-model="dlShow" width="600px">
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
        <div class="content_info">{{ form.address }}</div>
      </div>
      <div class="info_content">
        <div class="name">状态：</div>
        <div class="content_info">{{ form.status }}</div>
      </div>
      <div class="info_content">
        <div class="name">处理人：</div>
        <div class="content_info">{{ form.handler}}</div>
      </div>
      <div class="info_content">
        <div class="name">处理结果：</div>
        <div class="content_info">{{ form.status }}</div>
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
    </el-dialog> -->
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
        <div class="content_info">{{ form.address }}</div>
      </div>
      <!-- <div class="info_content">
        <div class="name">状态：</div>
        <div class="content_info">{{ form.status }}</div>
      </div> -->
      <div class="info_content">
        <div class="name">处理结果：</div>
        <div class="content_info"><el-input v-model="form.status" type="text"></el-input></div>
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
import { getrepairReportInfo, repairReportDelete, buildingAdd,  buildingEdit, repairReportHander } from "../../api/repair";
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
        reporter: ""
      },
      columns: [{ prop: "name", label: "名称", istrue: true }],
      form: {
        id: 0,
        title: "",
        type: ""
      },
      buildingList: [],
      authButton: sessionStorage.getItem('token') === 'admin'
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
      getrepairReportInfo({
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
      console.log("ajnsdj")
      formRef.value.validate(valid => {
        if (valid) {
          console.log(state)
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
        repairReportDelete(item.id).then(res => {
          ElMessage.success("删除数据成功");
          getList();
        });
      });
    };
    // 处理结果
    const handle = item => {
      // state.dialogVisible = true;
      state.status = '已修复'
      state.form = item;
      //   state.form.handler = null;
      // state.form.reporter = null;
      state.form.time = parseTime(state.form.timeString);
      const params = JSON.parse(JSON.stringify(state.form))
      params.status = '已修复';
      ElMessageBox.confirm("是否进行处理?", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        repairReportHander(params).then(res => {
          ElMessage.success("处理成功！");
          getList();
        });
      });
    };
    const submitHander = () => {
      repairReportHander(state.form).then(res => {
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
      handle,
      submitHander,
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
