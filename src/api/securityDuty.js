import request from '../utils/request'

export function getSecurityDutyList(params) {
	return request({
		url: '/commonInfo/securityDuty',
		method: 'get',
		params,
		hideloading: true
	})
}

export function securityDutyDelete(id) {
	return request({
		url: '/commonInfo/securityDuty/' + id,
		method: 'delete',
		hideloading: true
	})
}
export function buildingEdit(data) {
	return request({
		url: '/commonInfo/securityDuty',
		method: 'PUT',
		data,
		hideloading: true,
		type: "json"
	})
}
export function buildingAdd(data) {
	return request({
		url: '/commonInfo/securityDuty',
		method: 'post',
		data,
		hideloading: true,
		type: "json"
	})
}