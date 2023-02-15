import request from '../utils/request'
//社区公共管理
export function getAnnouncementList(params) {
	return request({
		url: '/commonInfo/announcement',
		method: 'get',
		params,
		hideloading: true
	})
}

export function announcementDelete(id) {
	return request({
		url: '/commonInfo/announcement/' + id,
		method: 'delete',
		hideloading: true
	})
}
export function buildingEdit(data) {
	return request({
		url: '/commonInfo/announcement',
		method: 'PUT',
		data,
		hideloading: true,
		type: "json"
	})
}
export function buildingAdd(data) {
	return request({
		url: '/commonInfo/announcement',
		method: 'post',
		data,
		hideloading: true,
		type: "json"
	})
}