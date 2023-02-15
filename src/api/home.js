import qs from 'qs'
// axios
import request from '@/utils/request'
// home api

/**
 * 
 * @param {首页报修统计} params 
 * @returns 
 */
export function repairReportData(params) {
	return request({
		url: '/repairReport/pie',
		method: 'get',
		params,
		hideloading: true
	})
}
/**
 * 
 * @param {首页缴费统计} params 
 * @returns 
 */
export function payLogData(params) {
	return request({
		url: '/payLog/bar',
		method: 'get',
		params,
		hideloading: true
	})
}