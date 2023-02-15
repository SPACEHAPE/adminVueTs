<template>
  <div class="welcome">
    <div class="top_container" v-if="authBotton">
      <el-row :gutter="15" >
        <el-col :lg="6" :md="6">
          <el-card shadow="never">
            <sc-statistic title="车位数" :value="pakingLength" tips="Tips" suffix="个" :groupSeparator="true"></sc-statistic>
          </el-card>
        </el-col>
        <el-col :lg="6" :md="6">
          <el-card shadow="never">
            <sc-statistic title="缴费记录" :value="payAmount" suffix="条" :groupSeparator="true"> </sc-statistic>
          </el-card>
        </el-col>
        <el-col :lg="6" :md="6">
          <el-card shadow="never">
            <sc-statistic title="投诉报修数" :value="complaintLength" suffix="条" :groupSeparator="true"> </sc-statistic>
          </el-card>
        </el-col>
        <el-col :lg="6" :md="6">
          <el-card shadow="never">
            <sc-statistic title="业主户数" :value="ownerLength" suffix="户" :groupSeparator="true"> </sc-statistic>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <el-row :gutter="15" style="margin-top: 20px" v-if="authBotton">
      <el-col :lg="24">
        <el-card shadow="never">
          <LineMarker width="100%" :chart-data="lineChartData" chartName="入住人数" />
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="15" class="echart_container" v-if="authBotton">
      <el-col :lg="8">
        <el-card shadow="never">
          <scEcharts height="300px" :option="option1"></scEcharts>
        </el-card>
      </el-col>
      <el-col :lg="8">
        <el-card shadow="never">
          <scEcharts height="300px" :option="option2"></scEcharts>
        </el-card>
      </el-col>
      <el-col :lg="8">
        <el-card shadow="never">
          <scEcharts height="300px" :option="option3"></scEcharts>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="15" style="margin-top: 20px" v-if="!authBotton">
      <el-col :lg="24">
        <el-card shadow="never">
          <LineMarker width="100%" height="450px" :chart-data="lineChartData" chartName="家庭消费" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import scEcharts from "../components/scEcharts/index.vue";
import scStatistic from "../components/scStatistic/index.vue";
import LineMarker from "../components/scEcharts/LineMarker.vue";
import { defineComponent, ref, reactive, toRefs, computed } from "vue";
import { repairReportData, payLogData } from "../api/home";
import { getparkingInfo } from "../api/parking";
import { getSuggestList, getHouseSuggestList, getparkingSuggestList } from "../api/suggest";

export default defineComponent({
  components: { scEcharts, scStatistic, LineMarker },
  setup() {
    const username = ref(localStorage.getItem("ms_username") ? localStorage.getItem("ms_username") : "yangkai");
    const state = reactive({
      authBotton: sessionStorage.getItem('token') === 'admin',
      option1Data: [],
      option3Data: [],
      line1: 0,
      line2: 0,
      line3: 0,
      line4: 0,
      pakingLength: 0,
      payAmount: 0,
      complaintLength: 0,
      ownerLength: 0,
      lineChartData: {
        actualData: [100, 234, 579, 1287], // 数据
        actualDate: ["2022-01", "2022-02", "2022-03", "2022-04"] // 时间
      },
      option1: {
        title: {
          text: "报修统计"
        },
        tooltip: {
          trigger: "item"
        },
        series: [
          {
            name: "报修统计",
            type: "pie",
            radius: ["40%", "70%"],
            center: ["50%", "60%"],
            label: false,
            data: computed(() => {
              return state.option1Data;
            })
          }
        ]
      },
      option2: {
        title: {
          text: "业主、房屋、车位雷达图"
        },
        tooltip: {
          trigger: "item"
        },
        radar: {
          radius: 100,
          center: ["50%", "55%"],
          indicator: [
            { name: "业主", max: 100 },
            { name: "房屋", max: 100 },
            { name: "车位", max: 100 }
          ]
        },
        series: [
          {
            name: "SCUI",
            type: "radar",
            areaStyle: {},
            data: [
              {
                value: computed(() => {
                  return [state.line1, state.line2, state.line3];
                })
              }
            ]
          }
        ]
      },
      option3: {
        title: {
          text: "物业费缴费统计"
        },
        xAxis: {
          type: "category",
          data: ["已缴费", "未缴费"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: computed(() => {
              return state.option3Data;
            }),
            type: "bar"
          }
        ]
      }
    });
    const option1Data = () => {
      getparkingInfo({ pageNo: 1, pageSize: 10000 }).then(res => {
        console.log(res)
        let data = res.data.data;
        state.pakingLength = data[0].value;
        state.payAmount = data[1].value;
        state.complaintLength = data[2].value;
        state.ownerLength = data[3].value
        state.line4 = data.line4;
        state.line1 = data[3].value;
        state.line2 = data[4].value;
        state.line3 =data[0].value;
      });
      // //缴费
      // paymentSuggestList().then(res => {
      //   let data = res.data;
      //   let result = data.map(m => m.amount);
      //   let priceArrNew = result.reduce((n, m) => n + m); //求和
      //   state.payAmount = priceArrNew;
      // });
      // //投诉信息条数
      // complaintSuggestList().then(res => {
      //   state.complaintLength = res.data.length;
      // });
      // repairReportSuggestList().then(res => {
      //   state.line4 = res.data.length;
      // });
      repairReportData().then(res => {
        let data = res.data.data;
        state.option1Data = data;
      });
      payLogData().then(res => {
        let data = res.data.data;
        state.option3Data = data;
      });
    };
    option1Data();
    return {
      ...toRefs(state),
      username
    };
  }
});
</script>

<style lang="scss" scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}
.welcome {
  height: 100%;
  position: relative;
  @keyframes identifier {
    0% {
      left: 200px;
    }
    100% {
      left: 0;
    }
  }
  p {
    font-size: 28px;
    position: absolute;
    left: 0;
    width: 100%;
    top: 50%;
    text-align: center;
    transform: translateY(-50%);
    animation: identifier 1s;
  }
  .top_container {
    width: 80%;
    max-width: 1000px;
    display: flex;
    justify-content: center;
    margin: 20px auto 0 auto;
    > div {
      width: 100%;
    }
  }
  .echart_container {
    margin-top: 20px;
  }
}
</style>
