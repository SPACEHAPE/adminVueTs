import api from './index'
// axios
import request from '../utils/request'

export function getHouseList(params) {
	return request({
		url: api.houseList,
		method: 'get',
		params,
		hideloading: true
	})
}
export function houseDelete(id) {
	return request({
		url: api.houseDelete + "/" + id,
		method: 'delete',
		hideloading: true
	})
}
export function buildingEdit(data) {
	return request({
		url: api.houseList,
		method: 'PUT',
		data,
		hideloading: true,
		type: "json"
	})
}
export function buildingAdd(data) {
	return request({
		url: api.houseList,
		method: 'post',
		data,
		hideloading: true,
		type: "json"
	})
}