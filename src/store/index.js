import {
	createStore
} from 'vuex'
import {
	login,
	getUserInfo
} from "../api/user"
export default createStore({
	state: {
		tagsList: [],
		collapse: false,
		userInfo: JSON.parse(localStorage.getItem('userInfo')) || {}
	},
	mutations: {
		SET_USERINFO(state, data) {
			localStorage.setItem('userInfo', JSON.stringify(data))
			state.userInfo = data
		},
		delTagsItem(state, data) {
			state
				.tagsList
				.splice(data.index, 1);
		},
		setTagsItem(state, data) {
			state
				.tagsList
				.push(data)
		},
		clearTags(state) {
			state.tagsList = []
		},
		closeTagsOther(state, data) {
			state.tagsList = data;
		},
		closeCurrentTag(state, data) {
			for (let i = 0, len = state.tagsList.length; i < len; i++) {
				const item = state.tagsList[i];
				if (item.path === data.$route.fullPath) {
					if (i < len - 1) {
						data
							.$router
							.push(state.tagsList[i + 1].path);
					} else if (i > 0) {
						data
							.$router
							.push(state.tagsList[i - 1].path);
					} else {
						data
							.$router
							.push("/");
					}
					state
						.tagsList
						.splice(i, 1);
					break;
				}
			}
		},
		// 侧边栏折叠
		handleCollapse(state, data) {
			state.collapse = data;
		}
	},
	actions: {
		// user login
		login({
			commit
		}, userInfo) {
			const {
				loginName,
				password,
			} = userInfo
			return new Promise((resolve, reject) => {
				let params = {
					loginName: loginName.trim(),
					password: password,
				}

				login(params).then(response => {
					if (response.code == 0) {
						localStorage.setItem("ms_username", params.loginName);
						localStorage.setItem("token", response.data);
						resolve(response)
						// getUserInfo().then(res => {
						// 	if (res.code == 0) {
						// 		commit('SET_USERINFO', res.data)
						// 		resolve(response)
						// 	}
						// })

					}

				}).catch(error => {

					reject(error)
				})
			})
		}
	},
	modules: {}
})