import request from '../utils/request'

export function getComplaintList(params) {
	return request({
		url: '/commonInfo/complaint',
		method: 'get',
		params,
		hideloading: true
	})
}

export function complaintDelete(id) {
	return request({
		url: '/complaint/' + id,
		method: 'delete',
		hideloading: true
	})
}
/**
 * 
 * @param {处理} data 
 * @returns 
 */
export function complaintHander(data) {
	return request({
		url: '/complaint',
		method: 'PUT',
		data,
		hideloading: true,
		type: "json"
	})
}