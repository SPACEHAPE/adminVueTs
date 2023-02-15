import request from '../utils/request'
/**
 * 
 * @param {问卷标题管理} params 
 * @returns 
 */
export function getQuestionnaireList(params) {
	return request({
		url: '/questionnaire',
		method: 'get',
		params,
		hideloading: true
	})
}
export function questionTitleEdit(data) {
	return request({
		url: '/questionnaire',
		method: 'PUT',
		data,
		hideloading: true,
		type: "json"
	})
}
export function questionTitleAdd(data) {
	return request({
		url: '/questionnaire',
		method: 'post',
		data,
		hideloading: true,
		type: "json"
	})
}
/**
 * 删除
 * @param {*} id 
 * @returns 
 */
export function questionnaireDelete(id) {
	return request({
		url: '/questionnaire/' + id,
		method: 'delete',
		hideloading: true
	})
}

//  问卷 问题
/**
 * 
 * @param {问卷问题列表} params 
 * @returns 
 */
export function getQuestionnaireQuestionList(params) {
	return request({
		url: '/questionnaireQuestion',
		method: 'get',
		params,
		hideloading: true
	})
}
export function questionQsEdit(data) {
	return request({
		url: '/questionnaireQuestion',
		method: 'PUT',
		data,
		hideloading: true,
		type: "json"
	})
}
export function questionQsAdd(data) {
	return request({
		url: '/questionnaireQuestion',
		method: 'post',
		data,
		hideloading: true,
		type: "json"
	})
}
/**
/**
 * 
 * @param {删除问卷问题} id 
 * @returns 
 */
export function questionnaireQuestionDelete(id) {
	return request({
		url: '/questionnaireQuestion/' + id,
		method: 'delete',
		hideloading: true
	})
}



//问卷结果
/**
 * 
 * @param {问卷结果列表} params 
 * @returns 
 */
export function getQuestionnaireResultList(params) {
	return request({
		url: '/questionnaireResult',
		method: 'get',
		params,
		hideloading: true
	})
}


/**
 * 删除问卷结果
 * @param {*} id 
 * @returns 
 */
export function questionnaireResultDelete(id) {
	return request({
		url: '/questionnaireResult/' + id,
		method: 'delete',
		hideloading: true
	})
}