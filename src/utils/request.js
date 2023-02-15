import axios from 'axios'
import store from '../store'
import {
	ElMessage
} from 'element-plus'
import qs from 'qs'
// 根据环境不同引入不同api地址
// create an axios instance
const service = axios.create({
	baseURL: '/api', // url = base api url + request url
	// withCredentials: true, // send cookies when cross-domain requests
	timeout: 5000 // request timeout
})

// request拦截器 request interceptor
// service.interceptors.request.use(
// 	config => {
// 		// 不传递默认开启loading
// 		if (!config.hideloading) {

// 		}
// 		if (!config.type) {
// 			config.data = qs.stringify(config.data) // 转为formdata数据格式
// 			config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
// 		} else {
// 			config.headers['Content-Type'] = 'application/json'
// 		}

// 		if (store.getters.token) {
// 			config.headers['X-Token'] = ''
// 		}
// 		return config
// 	},
// 	error => {
// 		// do something with request error
// 		console.log(error) // for debug
// 		return Promise.reject(error)
// 	}
// )
// respone拦截器
// service.interceptors.response.use(
// 	response => {
// 		const res = response.data
// 		if (res.status && res.status !== 200) {
// 			// 登录超时,重新登录
// 			if (res.status === 401) {
// 				store.dispatch('FedLogOut').then(() => {
// 					location.reload()
// 				})
// 			}
// 			ElMessage.error(res)
// 			return Promise.reject(res || 'error')
// 		} else {
// 			if (res.successful) {
// 				return Promise.resolve(res)
// 			} else {
// 				ElMessage.error(res.message)
// 				return Promise.reject(res.message || 'error')
// 			}
// 		}
// 	},
// 	error => {
// 		// console.log('err' + JSON.stringify(error)) // for debug
// 		ElMessage.error(error.message)
// 		return Promise.reject(error)
// 	}
// )

export default service