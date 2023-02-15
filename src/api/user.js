import api from './index'
import qs from 'qs'
// axios
import request from '../utils/request'

// 登录
export function login(data) {
	return request({
		url: api.Login,
		method: 'post',
		data
	})
}

// 用户信息 post 方法
export function getUserInfo(data) {
	return request({
		url: 'login/current',
		method: 'get',
		data,
		hideloading: true
	})
}

// 用户名称 get 方法
export function getUserName(params) {
	return request({
		url: api.UserName,
		method: 'get',
		params,
		hideloading: true
	})
}
/**
 * 用户列表
 * @param {*} params 
 * @returns 
 */
export function getUserList(params) {
	return request({
		url: '/getUser',
		method: 'get',
		params,
		hideloading: true
	})
}
/**
 * 
 * @param {删除用户} id 
 * @returns 
 */
export function userDelete(id) {
	return request({
		url: '/userList/delete/' + id,
		method: 'delete',
		hideloading: true
	})
}
/**
 * 
 * @param {获取用户信息} id 
 * @returns 
 */
export function userMsg(id) {
	return request({
		url: '/user/' + id,
		method: 'get',
		hideloading: true
	})
}
/**
 * 
 * @param {修改用户信息} data 
 * @returns 
 */
export function submitUser(data) {

	return request({
		url: '/userList/changeInfo',
		data,
		method: 'PUT',
		hideloading: true,
		type: "json"
	})
}
/**
 * 
 * @param {新增用户信息} data 
 * @returns 
 */
export function userAdd(data) {
	return request({
		url: '/userList/addUser',
		method: 'post',
		data,
		hideloading: true,
		type: "json"
	})
}