//分页查询列表
import { ref, unref, reactive, toRefs,getCurrentInstance } from "vue"
export default function () {

  const formRef = ref(null);

  const formState = reactive({
    dlShow: false,
    checkShow: false,
  })
  const {proxy} = getCurrentInstance();
  const reset = () => {
    const form = unref(formRef)
    form.resetFields()
    formState.dlShow = false
    formState.checkShow = false
  }
  const showDialog = (item) => {
    item =JSON.parse(JSON.stringify(item))
    if(item){
      proxy.form = item;
    }
    formState.dlShow = true;
  }

  const checkDialog = (item) => {
    item =JSON.parse(JSON.stringify(item))
    if(item){
      proxy.form = item;
    }
    formState.checkShow = true;
  }

  return {
    formRef,
    ...toRefs(formState),
    reset,
    showDialog,
    checkDialog,
  }
}