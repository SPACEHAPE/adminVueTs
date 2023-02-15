<template>
  <div class="sidebar">
    <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157" text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template #title>
              <i :class="item.icon"></i>
              <span>{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                <template #title>{{ subItem.title }}</template>
                <el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.index"> {{ threeItem.title }}</el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="subItem.index" :key="subItem.index">{{ subItem.title }} </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index" v-if="!item.hidden">
            <i :class="item.icon"></i>
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { computed, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
export default {
  setup() {
    const items = [
      {
        icon: "el-icon-lx-home",
        index: "/welcome",
        title: "系统首页"
      },
      {
        icon: "el-icon-lx-calendar",
        index: "3",
        title: "基本信息管理",
        subs: [
          {
            index: "/building-list",
            title: "楼宇管理"
          },
          {
            index: "/building-unit-list",
            title: "单元管理"
          },
          {
            index: "/house-list",
            title: "房屋管理"
          },
          {
            index: "/parking-list",
            title: "车位信息管理"
          },
          {
            index: "/owner-list",
            title: "业主信息管理"
          }
        ]
      },
      {
        icon: "el-icon-lx-cascades",
        index: "4",
        title: "社区服务管理",
        subs: [
          {
            icon: "el-icon-lx-cascades",
            index: "/announcement-list",
            title: "社区公告管理"
          },
          {
            index: "/repair-list",
            title: "报修投诉信息管理"
          },
          // {
          //   index: "/complaint-list",
          //   title: "投诉信息管理"
          // },
          // {
          //   index: "/pet-list",
          //   title: "宠物信息管理"
          // },
          {
            index: "/securityDuty-list",
            title: "保安执勤管理"
          },
          // {
          //   index: "/subletting-list",
          //   title: "转租管理"
          // }
        ]
      },
      {
        icon: "el-icon-lx-recharge",
        index: "5",
        title: "缴费管理",
        index: "/payment-list",
        // subs: [
        //   {
        //     index: "/paymentType-list",
        //     title: "缴费类型管理"
        //   },
        //   {
        //     index: "/payment-list",
        //     title: "缴费信息管理"
        //   }
        // ]
      },
      // {
      //   icon: "el-icon-lx-global",
      //   index: "/epidemic-list",
      //   title: "疫情防控管理"
      // },
      {
        icon: "el-icon-lx-people",
        index: "/user-list",
        title: "用户管理"
      },
    ];

    const role = sessionStorage.getItem("token")
    if(role !== 'admin'){
       items[items.length - 1].hidden = true
    }

    const route = useRoute();

    const onRoutes = computed(() => {
      return route.path;
    });

    const store = useStore();
    const collapse = computed(() => store.state.collapse);

    return {
      items,
      onRoutes,
      collapse,
      role
    };
  }
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 220px;
}
.sidebar > ul {
  height: 100%;
}
</style>
