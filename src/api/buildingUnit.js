import api from './index'
// axios
import request from '../utils/request'

export function getBuildingUnitList(params) {
	return request({
		url: api.buildingUnitList,
		method: 'get',
		params,
		hideloading: true
	})
}

export function buildingDelete(id) {
	return request({
		url: api.buildingUnitDelete + "/" + id,
		method: 'delete',
		hideloading: true
	})
}
export function buildingEdit(data) {
	return request({
		url: '/baseInfo/buildingUnit',
		method: 'put',
		data,
		hideloading: true,
		type: "json"
	})
}
export function buildingAdd(data) {
	return request({
		url: "/baseInfo/buildingUnit",
		method: 'post',
		data,
		hideloading: true,
		type: "json"
	})
}