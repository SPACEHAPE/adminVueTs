import request from '../utils/request'

export function getPayLogList(params) {
	return request({
		url: '/payment/payLog',
		method: 'get',
		params,
		hideloading: true
	})
}

export function payLogDelete(id) {
	return request({
		url: '/payment/delete/' + id,
		method: 'delete',
		hideloading: true
	})
}
export function payment(data) {
	return request({
		url: '/payment/changeStatus',
		method: 'post',
		data,
		hideloading: true,
	})
}

export function payLogEdit(params) {
	return request({
		url: '/payment/payLog',
		method: 'put',
		params,
		hideloading: true
	})
}

export function payLogAdd(data) {
	return request({
		url: '/payment/payLog',
		method: 'post',
		data,
		hideloading: true
	})
}