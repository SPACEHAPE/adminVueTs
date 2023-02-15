//分页查询列表
import {
	reactive,
	getCurrentInstance,
	ref,
	unref,
	onMounted
} from "vue"
export default function () {
	const pageState = reactive({
		pageNo: 1,
		pageTotal: 0,
		pageSize: 10,
		tableData: [],
	})
	const queryForm = ref(null);

	const {
		proxy
	} = getCurrentInstance();

	//分页切换
	const handlePageChange = (page) => {
		pageState.pageNo = page;
		proxy.getList()
	}
	//重置搜索数据
	const resetForm = () => {
		const form = unref(queryForm)
		form.resetFields()
		pageState.pageNo = 1;
		proxy.getList()
	}

	onMounted(() => {
		proxy.getList();
	})
	return {
		pageState,
		queryForm,
		// getList,
		handlePageChange,
		resetForm,
	}
}