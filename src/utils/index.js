 import FileSaver from "file-saver";
 import * as XLSX from "xlsx";

 export const htmlToExcel = {
 	getExcel(dom, title = 'xzdTable', ) {
 		let excelTitle = title;
 		let wb = XLSX.utils.table_to_book(document.querySelector(dom));
 		/* 获取二进制字符串作为输出 */
 		let wbout = XLSX.write(wb, {
 			bookType: "xlsx",
 			bookSST: true,
 			type: "array"
 		});
 		try {
 			FileSaver.saveAs(
 				new Blob([wbout], {
 					type: "application/octet-stream"
 				}),
 				excelTitle + ".xlsx"
 			);
 		} catch (e) {
 			if (typeof console !== "undefined") console.log(e, wbout);
 		}
 		return wbout;
 	}
 };
 /**
  * @param {Function} func
  * @param {number} wait
  * @param {boolean} immediate
  * @return {*}
  */
 export function debounce(func, wait, immediate) {
 	let timeout, args, context, timestamp, result

 	const later = function () {
 		// 据上一次触发时间间隔
 		const last = +new Date() - timestamp

 		// 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
 		if (last < wait && last > 0) {
 			timeout = setTimeout(later, wait - last)
 		} else {
 			timeout = null
 			// 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
 			if (!immediate) {
 				result = func.apply(context, args)
 				if (!timeout) context = args = null
 			}
 		}
 	}

 	return function (...args) {
 		context = this
 		timestamp = +new Date()
 		const callNow = immediate && !timeout
 		// 如果延时不存在，重新设定延时
 		if (!timeout) timeout = setTimeout(later, wait)
 		if (callNow) {
 			result = func.apply(context, args)
 			context = args = null
 		}

 		return result
 	}
 }
 /**
  * Parse the time to string
  * @param {(Object|string|number)} time
  * @param {string} cFormat
  * @returns {string | null}
  */
 export function parseTime(time, cFormat) {
 	if (arguments.length === 0 || !time) {
 		return null
 	}
 	const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
 	let date
 	if (typeof time === 'object') {
 		date = time
 	} else {
 		if ((typeof time === 'string')) {
 			if ((/^[0-9]+$/.test(time))) {
 				// support "1548221490638"
 				time = parseInt(time)
 			} else {
 				// support safari
 				// https://stackoverflow.com/questions/4310953/invalid-date-in-safari
 				time = time.replace(new RegExp(/-/gm), '/')
 			}
 		}

 		if ((typeof time === 'number') && (time.toString().length === 10)) {
 			time = time * 1000
 		}
 		date = new Date(time)
 	}
 	const formatObj = {
 		y: date.getFullYear(),
 		m: date.getMonth() + 1,
 		d: date.getDate(),
 		h: date.getHours(),
 		i: date.getMinutes(),
 		s: date.getSeconds(),
 		a: date.getDay()
 	}
 	const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
 		const value = formatObj[key]
 		// Note: getDay() returns 0 on Sunday
 		if (key === 'a') {
 			return ['日', '一', '二', '三', '四', '五', '六'][value]
 		}
 		return value.toString().padStart(2, '0')
 	})
 	return time_str
 }