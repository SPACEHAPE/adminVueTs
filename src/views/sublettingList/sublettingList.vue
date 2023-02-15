<template>
  <div class="buildingList">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 社区服务管理 </el-breadcrumb-item>
        <el-breadcrumb-item> 转租管理 </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-form :model="query" ref="queryForm" class="searchForm">
          <el-form-item>
            <el-select class="mr10 query-input" v-model="query.houseId" placeholder="请选择房屋">
              <el-option v-for="(item, index) in houseList" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select class="mr10 query-input" v-model="query.lessorId" placeholder="请选择出租人">
              <el-option v-for="(item, index) in userSuggestList" :key="index" :label="item.realname" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select class="mr10 query-input" v-model="query.status" placeholder="请选择出租人">
              <el-option label="所有" value=""></el-option>
              <el-option label="未审核" value="未审核"></el-option>
              <el-option label="已审核" value="已审核"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="query.tenantName" autocomplete="off" placeholder="租赁人" class="query-input mr10"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handlePageChange(1)">搜索</el-button>
            <el-button type="info" plain icon="el-icon-refresh" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table stripe border :data="tableData" style="margin-top: 10px">
        <el-table-column header-align="center" align="center" prop="house" label="房屋"> </el-table-column>
        <el-table-column header-align="center" align="center" prop="realname" label="出租人"> </el-table-column>
        <el-table-column header-align="center" align="center" prop="tel" label="出租人电话"> </el-table-column>
        <el-table-column header-align="center" align="center" prop="tenantName" label="租赁人"> </el-table-column>
        <el-table-column header-align="center" align="center" prop="tenantTel" label="租赁人电话"> </el-table-column>
        <el-table-column header-align="center" align="center" prop="purpose" label="用途"> </el-table-column>
        <el-table-column header-align="center" align="center" prop="status" label="状态"> </el-table-column>
        <el-table-column header-align="center" align="center" prop="deliveryDateString" label="审核时间"> </el-table-column>

        <el-table-column label="操作" width="330" align="center">
          <template #default="scope">
            <el-button class="mr10" type="primary" size="mini" @click="showDialog(scope.row)"> 查看 </el-button>
            <el-button type="primary" size="mini" @click="handerFun(scope.row)">审核</el-button>
            <el-button type="danger" size="mini" @click="deletes(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
      </div>
    </div>
    <el-dialog title="查看转租信息" v-model="dlShow" width="600px">
      <div class="info_content">
        <div class="name">房屋：</div>
        <div class="content_info">{{ form.house}}</div>
      </div>
      <div class="info_content">
        <div class="name">出租人：</div>
        <div class="content_info">{{ form.realname }}</div>
      </div>
      <div class="info_content">
        <div class="name">电话：</div>
        <div class="content_info">{{ form.tel }}</div>
      </div>
      <div class="info_content">
        <div class="name">租赁人：</div>
        <div class="content_info">{{ form.tenantName }}</div>
      </div>
      <div class="info_content">
        <div class="name">租赁人电话：</div>
        <div class="content_info">{{ form.tenantTel }}</div>
      </div>
      <div class="info_content">
        <div class="name">交房日期：</div>
        <div class="content_info">{{ form.deliveryDateString }}</div>
      </div>
      <div class="info_content">
        <div class="name">用途：</div>
        <div class="content_info">{{ form.purpose }}</div>
      </div>
      <div class="info_content">
        <div class="name">状态</div>
        <div class="content_info">{{ form.status }}</div>
      </div>
      <div class="info_content">
        <div class="name">审核时间：</div>
        <div class="content_info">{{ form.approvalTimeString }}</div>
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
import { parseTime } from "../../utils/index.js";
import pageList from "../../hooks/pageList";
import addForm from "../../hooks/addForm";
import { getHouseSuggestList, getSuggestList } from "../../api/suggest";
import { getSubleaseLogList, subleaseLogDelete, subleaseLogHander } from "../../api/subleaseLog";
import { ElMessage, ElMessageBox } from "element-plus";
export default {
  setup() {
    const { queryForm, pageState, resetForm, handlePageChange } = pageList();
    const addFormObj = addForm({
      houseId: "",
      lessorId: "",
      tenantName: "", //租赁人
      status: ""
    });
    const { formRef, reset } = addFormObj;
    const state = reactive({
      query: {
        houseId: "",
        lessorId: "",
        tenantName: "", //租赁人
        status: ""
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
      houseList: [],
      userSuggestList: []
    });
    const rules = {
      name: [{ required: true, message: "请输入楼宇名称", trigger: "blur" }]
      // type: [{ required: true, message: '请选择类型', trigger: 'change' }],
    };
    //获取楼宇列表
    const getbuildingList = () => {
      getHouseSuggestList().then(res => {
        state.houseList = res.data;
      });
      getSuggestList().then(res => {
        state.userSuggestList = res.data;
      });
    };
    getbuildingList();
    // 获取列表
    const getList = () => {
      getSubleaseLogList({
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
        subleaseLogDelete(item.id).then(res => {
          ElMessage.success("删除数据成功");
          getList();
        });
      });
    };
    // 审核
    const handerFun = item => {
      let data = {
        id: item.id,
        oldStatus: "未审核",
        newStatus: "已审核"
      };
      ElMessageBox.confirm("是否继续审核?", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        subleaseLogHander(data).then(res => {
          ElMessage.success("审核成功！");
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
      handerFun
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
