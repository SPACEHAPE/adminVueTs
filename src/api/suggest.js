import api from './index'
// axios
import request from '../utils/request'
/**
 * 
 * @param {出租人、业主option} params 
 * @returns 
 */
export function getSuggestList(params) {
	return request({
		url: '/baseInfo/suggest',
		method: 'get',
		params,
		hideloading: true
	})
}
/**
 * 
 * @param {房屋option} params 
 * @returns 
 */
export function getHouseSuggestList(params) {
	return request({
		url: '/baseInfo/house/suggest',
		method: 'get',
		params,
		hideloading: true
	})
}
/**
 * 
 * @param {停车位option} params 
 * @returns 
 */
export function getparkingSuggestList(params) {
	return request({
		url: '/baseInfo/parkingLog/suggest',
		method: 'get',
		params,
		hideloading: true
	})
}
/**
 * 
 * @param {缴费类型option} params 
 * @returns 
 */
export function paymentSuggestList(params) {
	return request({
		url: '/payment/suggestList',
		method: 'get',
		params,
		hideloading: true
	})
}
/**
 * 
 * @param {问卷类型option} params 
 * @returns 
 */
export function questionnaireSuggestList(params) {
	return request({
		url: '/questionnaire/suggest',
		method: 'get',
		params,
		hideloading: true
	})
}
/**
 * 
 * @param {投诉信息ption} params 
 * @returns 
 */
export function complaintSuggestList(params) {
	return request({
		url: '/complaint/suggest',
		method: 'get',
		params,
		hideloading: true
	})
}
/**
 * 
 * @param {报修信息ption} params 
 * @returns 
 */
export function repairReportSuggestList(params) {
	return request({
		url: '/repairReport/suggest',
		method: 'get',
		params,
		hideloading: true
	})
}