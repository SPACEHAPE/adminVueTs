import request from '../utils/request'

export function getPetList(params) {
	return request({
		url: '/commonInfo/pet',
		method: 'get',
		params,
		hideloading: true
	})
}

export function petDelete(id) {
	return request({
		url: '/commonInfo/pet/' + id,
		method: 'delete',
		hideloading: true
	})
}

// 新增
export function petAdd(data) {
	return request({
		url: '/commonInfo/pet',
		method: 'post',
		data,
		hideloading: true,
		type: "json"
	})
}

// 修改
export function petChange(data) {
	return request({
		url: '/commonInfo/pet',
		method: 'put',
		data,
		hideloading: true,
		type: "json"
	})
}