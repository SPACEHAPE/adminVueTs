import api from './index'
// axios
import request from '../utils/request'


// 用户信息 post 方法
export function getWonerInfo(params) {
	return request({
		url: '/baseInfo/woner',
		method: 'get',
		params,
		hideloading: true
	})
}
export function wonerDelete(id) {
	return request({
		url: '/baseInfo/woner/' + id,
		method: 'delete',
		hideloading: true
	})
}
export function wonerEdit(data) {
	return request({
		url: '/baseInfo/woner',
		method: 'PUT',
		data,
		hideloading: true,
		type: "json"
	})
}
export function wonerAdd(data) {
	return request({
		url: '/baseInfo/woner',
		method: 'post',
		data,
		hideloading: true,
		type: "json"
	})
}