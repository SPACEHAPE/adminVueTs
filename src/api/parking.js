import api from './index'
// axios
import request from '../utils/request'


// 用户信息 post 方法
export function getparkingInfo(params) {
	return request({
		url: '/parkingLog',
		method: 'get',
		params,
		hideloading: true
	})
}

// 用户信息 post 方法
export function getparkingList(params) {
	return request({
		url: '/baseInfo/parkingList',
		method: 'get',
		params,
		hideloading: true
	})
}

export function pakingDelete(id) {
	return request({
		url: '/baseInfo/parkingList/' + id,
		method: 'delete',
		hideloading: true
	})
}
export function buildingEdit(data) {
	return request({
		url: "/baseInfo/parkingList",
		method: 'PUT',
		data,
		hideloading: true,
		type: "json"
	})
}
export function buildingAdd(data) {
	return request({
		url: "/baseInfo/parkingList",
		method: 'post',
		data,
		hideloading: true,
		type: "json"
	})
}