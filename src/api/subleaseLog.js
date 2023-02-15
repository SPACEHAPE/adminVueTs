import request from '../utils/request'

export function getSubleaseLogList(params) {
	return request({
		url: '/commonInfo/subleaseLog',
		method: 'get',
		params,
		hideloading: true
	})
}

export function subleaseLogDelete(id) {
	return request({
		url: '/subleaseLog/' + id,
		method: 'delete',
		hideloading: true
	})
}
/**
 * 
 * @param {审核} data 
 * @returns 
 */
export function subleaseLogHander(data) {
	return request({
		url: '/subleaseLog/changeStatus',
		method: 'post',
		data,
		hideloading: true,
	})
}