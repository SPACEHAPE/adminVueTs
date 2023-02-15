import {
	createRouter,
	createWebHashHistory
} from "vue-router";
import Home from "../views/Home.vue";

const routes = [{
	path: '/',
	redirect: '/welcome'
}, {
	path: "/",
	name: "Home",
	component: Home,
	children: [{
			path: '/404',
			name: '404',
			meta: {
				title: '找不到页面'
			},
			component: () => import( /* webpackChunkName: "404" */
				'../views/404.vue')
		}, {
			path: '/403',
			name: '403',
			meta: {
				title: '没有权限'
			},
			component: () => import( /* webpackChunkName: "403" */
				'../views/403.vue')
		},
		{
			path: "/welcome",
			name: "Welcome",
			component: () => import("./../views/Welcome.vue"),
			meta: {
				title: "Dashboard"
			}
		},
		{
			path: "/building-list",
			name: "buildingList",
			component: () => import("./../views/buildingList/buildingList.vue"),
			meta: {
				title: "楼宇管理"
			}
		},
		{
			path: "/building-unit-list",
			name: "buildingUnitList",
			component: () => import("./../views/buildingUnitList/buildingUnitList.vue"),
			meta: {
				title: "单元管理"
			}
		},
		{
			path: "/house-list",
			name: "house-list",
			component: () => import("./../views/houseList/houseList.vue"),
			meta: {
				title: "房屋管理"
			}
		},
		{
			path: "/parking-list",
			name: "parking-list",
			component: () => import("./../views/parkingList/parkingList.vue"),
			meta: {
				title: "车位信息管理"
			}
		},
		{
			path: "/owner-list",
			name: "owner-list",
			component: () => import("./../views/ownerList/ownerList.vue"),
			meta: {
				title: "业主信息管理"
			}
		},
		{
			path: "/announcement-list",
			name: "announcement-list",
			component: () => import("./../views/announcementList/announcementList.vue"),
			meta: {
				title: "公告信息管理"
			}
		},
		{
			path: "/repair-list",
			name: "repair-list",
			component: () => import("./../views/repaiList/repaiList.vue"),
			meta: {
				title: "报修投诉信息管理"
			}
		},
		{
			path: "/complaint-list",
			name: "complaint-list",
			component: () => import("./../views/complaintList/complaintList.vue"),
			meta: {
				title: "投诉信息管理"
			}
		},
		{
			path: "/pet-list",
			name: "pet-list",
			component: () => import("./../views/petList/petList.vue"),
			meta: {
				title: "宠物管理"
			}
		},
		{
			path: "/securityDuty-list",
			name: "securityDuty-list",
			component: () => import("./../views/securityDutyList/securityDutyList.vue"),
			meta: {
				title: "保安执勤管理"
			}
		},
		// {
		// 	path: "/subletting-list",
		// 	name: "subletting-list",
		// 	component: () => import("./../views/sublettingList/sublettingList.vue"),
		// 	meta: {
		// 		title: "转租管理"
		// 	}
		// },
		{
			path: "/paymentType-list",
			name: "paymentType-list",
			component: () => import("./../views/paymentTypeList/paymentTypeList.vue"),
			meta: {
				title: "缴费类型管理"
			}
		},
		{
			path: "/payment-list",
			name: "payment-list",
			component: () => import("./../views/paymentList/paymentList.vue"),
			meta: {
				title: "缴费信息管理"
			}
		},
		{
			path: "/epidemic-list",
			name: "epidemic-list",
			component: () => import("./../views/epidemicList/epidemicList.vue"),
			meta: {
				title: "疫情管理"
			}
		},
		{
			path: "/user-list",
			name: "user-list",
			hidden: true,
			component: () => import("./../views/userList/userList.vue"),
			meta: {
				title: "用户管理"
			}
		},
		{
			path: "/questionnaire-list",
			name: "questionnaire-list",
			component: () => import("./../views/questionnaireList/questionnaireList.vue"),
			meta: {
				title: "创建问卷调查"
			}
		},
		{
			path: "/questionnaire-options",
			name: "questionnaire-options",
			component: () => import("./../views/questionnaireOptions/questionnaireOptions.vue"),
			meta: {
				title: "问卷设置"
			}
		},
		{
			path: "/questionnaire-result",
			name: "questionnaire-result",
			component: () => import("./../views/questionnaireResult/questionnaireResult.vue"),
			meta: {
				title: "问卷结果"
			}
		},
		{
			path: "/personal-center",
			name: "/personal-center",
			component: () => import("./../views/personalCenter/personalCenter.vue"),
			meta: {
				title: "个人中心"
			}
		},
		{
			path: "/icon",
			name: "Icon",
			component: () => import("./../views/icon/index.vue"),
			meta: {
				title: "图标"
			}
		},
	]
}, {
	path: "/login",
	name: "Login",
	meta: {
		title: '登录'
	},
	component: () => import( /* webpackChunkName: "login" */ "../views/Login.vue")
}];

const router = createRouter({
	history: createWebHashHistory(),
	routes
});

router.beforeEach((to, from, next) => {
	document.title = `${to.meta.title} | 物业后台管理系统`;
	const role = sessionStorage.getItem('token');
	console.log(to)
	if (!role && to.path !== '/login') {
		next('/login');
	} else {
		if(role === 'admin') {
			console.log(routes)
			const arr = []
			routes[1].children = routes[1].children.filter(item => item.name !== 'user-list')
			router.addRoute(routes)
			console.log(router)
		}
		// next({ ...to, replace: true })
		next();
	}
});

export default router;