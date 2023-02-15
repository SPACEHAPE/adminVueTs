import request from '../utils/request'

export function getAntiepidemicLogList(params) {
	return request({
		url: '/commonInfo/antiepidemicLog',
		method: 'get',
		params,
		hideloading: true
	})
}

export function antiepidemicLogDelete(id) {
	return request({
		url: '/antiepidemicLog/' + id,
		method: 'delete',
		hideloading: true
	})
}
export function buildingEdit(data) {
	return request({
		url: '/antiepidemicLog',
		method: 'PUT',
		data,
		hideloading: true,
		type: "json"
	})
}
export function buildingAdd(data) {
	return request({
		url: '/antiepidemicLog',
		method: 'post',
		data,
		hideloading: true,
		type: "json"
	})
}