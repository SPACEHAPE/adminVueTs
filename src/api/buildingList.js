import api from './index'
// axios
import request from '../utils/request'

/**
 * 
 * @param {获取楼宇} params 
 * @returns 
 */
export function getBuildingList(params) {
	return request({
		url: api.buildingList,
		method: 'get',
		params,
		hideloading: true
	})
}

export function buildingDelete(id) {
	return request({
		url: api.buildingDelete + "/" + id,
		method: 'delete',
		hideloading: true
	})
}
export function buildingEdit(data) {
	return request({
		url: api.buildingDelete,
		method: 'put',
		data,
		hideloading: true,
		type: "json"
	})
}
export function buildingAdd(data) {
	return request({
		url: api.buildingAdd,
		method: 'post',
		data,
		hideloading: true,
		type: "json"
	})
}