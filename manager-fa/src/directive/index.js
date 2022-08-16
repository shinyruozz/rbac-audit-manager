import store from "../store";

/**
 * 用户是否有该权限显示
 * @param {*} app vue 实例
 */
function vHas(app) {
    app.directive("has", {
        beforeMount: function(el, binding) {
            let actionList = store.state.actionList,
                value = binding.value;

            const isHas = actionList.includes(value); //判断是否该按钮权限存在

            if (!isHas) {
                //没有该权限
                el.style = "display:none"; //先隐藏起来
                setTimeout(() => {
                    el.parentNode.removeChild(el); //删除元素
                });
            }
        },
    });
}

export { vHas };