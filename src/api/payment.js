import request from '../utils/request'

export function getPaymentList(params) {
	return request({
		url: '/payment',
		method: 'get',
		params,
		hideloading: true
	})
}

export function paymentDelete(id) {
	return request({
		url: '/payment/' + id,
		method: 'delete',
		hideloading: true
	})
}
export function buildingEdit(data) {
	return request({
		url: "/payment",
		method: 'PUT',
		data,
		hideloading: true,
		type: "json"
	})
}
export function buildingAdd(data) {
	return request({
		url: "/payment",
		method: 'post',
		data,
		hideloading: true,
		type: "json"
	})
}