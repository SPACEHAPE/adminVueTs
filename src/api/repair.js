import api from './index'
// axios
import request from '../utils/request'


// 用户信息 post 方法
export function getrepairReportInfo(params) {
	return request({
		url: '/commonInfo/repairReport',
		method: 'get',
		params,
		hideloading: true
	})
}
export function repairReportDelete(id) {
	return request({
		url: '/commonInfo/repairReport/' + id,
		method: 'delete',
		hideloading: true
	})
}
/**
 * 
 * @param {处理} data 
 * @returns 
 */
export function repairReportHander(data) {
	return request({
		url: '/commonInfo/repairReport',
		method: 'PUT',
		data,
		hideloading: true,
		type: "json"
	})
}

// 新增
export function buildingAdd(data) {
	return request({
		url: '/commonInfo/repairReport',
		method: 'post',
		data,
		hideloading: true,
		type: "json"
	})
}

// 修改
export function buildingEdit(data) {
	return request({
		url: '/commonInfo/repairReport',
		method: 'put',
		data,
		hideloading: true,
		type: "json"
	})
}