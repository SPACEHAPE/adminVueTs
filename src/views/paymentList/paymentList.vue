<template>
  <div class="buildingList">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i> 缴费管理
        </el-breadcrumb-item>
        <el-breadcrumb-item> 缴费信息管理 </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-form :model="query" ref="queryForm" class="searchForm">
          <el-form-item prop="displayTitle">
            <el-select
              class="mr10 query-input"
              v-model="query.displayTitle"
              placeholder="请选择缴费类型"
            >
              <el-option
                v-for="(item, index) in paymentList"
                :key="index"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="title">
            <el-input
              v-model="query.title"
              autocomplete="off"
              placeholder="标题"
              class="query-input mr10"
            ></el-input>
          </el-form-item>
          <el-form-item prop="status">
            <el-select
              class="mr10 query-input"
              v-model="query.status"
              placeholder="请选择缴费类型"
            >
              <el-option label="所有" value=""></el-option>
              <el-option label="已缴费" value="已缴费"></el-option>
              <el-option label="未缴费" value="未缴费"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="handlePageChange(1)"
              >搜索</el-button
            >
            <el-button
              type="info"
              plain
              icon="el-icon-refresh"
              @click="resetForm"
              >重置</el-button
            >
            <el-button
              type="primary"
              v-if="authButton"
              icon="el-icon-plus"
              @click="showDialog"
              >添加</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <el-table
        stripe
        border
        :data="tableData"
        style="margin-top: 10px"
        id="selectTable"
      >
        <el-table-column
          header-align="center"
          align="center"
          prop="title"
          label="标题"
        >
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="displayTitle"
          label="缴费类型"
        >
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="loginName"
          label="业主"
        >
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="timeString"
          label="时间"
        >
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="price"
          label="缴费金额(元)"
        >
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="status"
          label="状态"
        >
        </el-table-column>
        <el-table-column label="操作" width="330" align="center">
          <template #default="scope">
            <el-button
              class="mr10"
              type="primary"
              size="mini"
              @click="showDialog(scope.row)"
            >
              查看
            </el-button>
            <el-button
              class="mr10"
              type="primary"
              size="mini"
              @click="payMent(scope.row)"
              v-if="scope.row.status == '未缴费'"
            >
              缴费
            </el-button>
            <el-button type="danger" size="mini" @click="deletes(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :total="pageTotal"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>
    <el-dialog
      :title="form.id ? '编辑缴费信息' : '新增业主信息'"
      v-model="dlShow"
      width="600px"
      :before-close="reset"
      :opened="opendialog"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="标题：" prop="title">
          <el-input
            :disabled="form.id"
            v-model="form.title"
            placeholder="请输入标题："
            maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item label="缴费类型：" prop="userName">
          <el-select
            :disabled="form.id"
            class="mr10 query-input"
            v-model="form.displayTitle"
            placeholder="请选择缴费类型"
          >
            <el-option
              v-for="(item, index) in paymentList"
              :key="index"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户：" prop="realname">
          <el-input
            :disabled="form.id"
            v-model="form.loginName"
            placeholder="请输入用户账号名"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item label="缴费金额：" prop="price">
          <el-input
            :disabled="form.id"
            v-model="form.price"
            placeholder="请输入缴费金额"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item label="时间：" prop="timeString">
          <el-date-picker
            :disabled="form.id"
            v-model="form.timeString"
            type="datetime"
            placeholder="请选择日期"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD hh:mm:ss"
          />
        </el-form-item>
        <!-- <el-form-item label="企业" prop="company">
          <el-input v-model="form.company" placeholder="请输入企业名称"></el-input>
        </el-form-item>
        <el-form-item label="入住日期" prop="checkinDateString">
          <el-date-picker v-model="form.checkinDateString" type="datetime" placeholder="请选择日期" format="YYYY/MM/DD" value-format="YYYY-MM-DD hh:mm:ss" />
        </el-form-item>
        <el-form-item label="停车位" prop="parkingLot">
           <el-input v-model="form.parkingLot" placeholder="请输入停车位"></el-input>
        </el-form-item>
        <el-form-item label="房屋" prop="house">
          <el-input v-model="form.house" placeholder="请输入房屋"></el-input>
          <el-select class="mr10 query-input" v-model="form.houseId" placeholder="请选择房屋">
            <el-option v-for="(item, index) in houseSuggestList" :key="index" :label="item.name" :value="item.id"></el-option>
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
    <!-- <el-dialog title="查看缴费记录信息" v-model="dlShow" width="600px">
      <div class="info_content">
        <div class="name">缴费类型：</div>
        <div class="content_info">{{ form.displayTitle }}</div>
      </div>
      <div class="info_content">
        <div class="name">用户：</div>
        <div class="content_info">{{ form.realname }}</div>
      </div>
      <div class="info_content">
        <div class="name">时间：</div>
        <div class="content_info">{{ form.timeString }}</div>
      </div>
      <div class="info_content">
        <div class="name">状态：</div>
        <div class="content_info">{{ form.status }}</div>
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
import { htmlToExcel } from "../../utils/index.js";
import pageList from "../../hooks/pageList";
import addForm from "../../hooks/addForm";
import { paymentSuggestList } from "../../api/suggest";
import {
  getPayLogList,
  payLogDelete,
  payment,
  payLogAdd,
  payLogEdit,
} from "../../api/payLog";
import { ElMessage, ElMessageBox } from "element-plus";
export default {
  setup() {
    const { queryForm, pageState, resetForm, handlePageChange } = pageList();
    const addFormObj = addForm({
      paymentId: "",
      title: "",
      status: "",
    });
    const { formRef, reset } = addFormObj;
    const state = reactive({
      query: {
        paymentId: "",
        title: "",
        status: "",
      },
      columns: [
        { prop: "buildingId", label: "楼宇", istrue: true },
        { prop: "name", label: "名称", istrue: true },
      ],
      form: {
        id: 0,
        name: "",
        type: "",
      },
      paymentList: [], //缴费类型
      authButton: sessionStorage.getItem("token") === "admin",
    });
    const rules = {
      name: [{ required: true, message: "请输入楼宇名称", trigger: "blur" }],
      // type: [{ required: true, message: '请选择类型', trigger: 'change' }],
    };
    //获取楼宇列表
    const getbuildingList = () => {
      // paymentSuggestList().then(res => {
      //   state.paymentList = res.data;
      // });
    };
    getbuildingList();
    // 获取列表
    const getList = () => {
      getPayLogList({
        pageNo: pageState.pageNo,
        pageSize: pageState.pageSize,
        ...state.query,
      }).then((res) => {
        pageState.tableData = res.data.data;
        state.paymentList = [
          { name: "支付宝" },
          { name: "微信" },
          { name: "财付通" },
          { name: "信用卡" },
          { name: "银联" },
        ];
        pageState.pageTotal = res.data.recordsTotal;
      });
    };
    // 删除数据
    const deletes = (item) => {
      ElMessageBox.confirm("此操作将永久删除该数据, 是否继续?", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        payLogDelete(item.id).then((res) => {
          ElMessage.success("删除数据成功");
          getList();
        });
      });
    };
    //缴费
    const payMent = (item) => {
      let data = {
        id: item.id,
        oldStatus: "未缴费",
        newStatus: "已缴费",
      };
      ElMessageBox.confirm("是否进行缴费?", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        payment(data).then((res) => {
          ElMessage.success("缴费成功！");
          getList();
        });
      });
    };
    const excelExport = () => {
      htmlToExcel.getExcel("#selectTable", "缴费数据" + new Date().getTime());
    };

    //新增和编辑数据
    const dlHandle = () => {
      formRef.value.validate((valid) => {
        if (valid) {
          if (state.form.id) {
            // state.checkinDateString = state.checkinDate
            payLogEdit(state.form).then((res) => {
              ElMessage.success("修改成功");
              reset();
              getList();
            });
          } else {
            payLogAdd(state.form).then((res) => {
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
      payMent,
      excelExport,
      dlHandle,
    };
  },
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
