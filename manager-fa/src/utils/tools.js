export default {
    //格式化日期
    dateFormat(date, rule) {
        let fmt = rule || "yyyy-MM-dd hh:mm:ss";

        date = new Date(date);
        const o = {
            "y+": date.getFullYear(),
            "M+": date.getMonth() + 1,
            "d+": date.getDate(),
            "h+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds(),
        };

        for (let k in o) {
            let reg = new RegExp(k);
            let value = o[k] + "";
            fmt = fmt.replace(reg, function($1) {
                if (value.length < 2) {
                    value = value.padStart(2, "0");
                }
                return value;
            });
        }

        return fmt;
    },
    /**
     *
     * @param {Array} data menu数据
     * @param {Array} list 递归赋值数组
     * @param {String} _id  //查询的id
     * @returns
     */
    setMenuTree(data, list, _id) {
        let arr = list || [];

        data.map((item) => {
            let pid = item.parentId;

            if (!_id) {
                //没有父级菜单
                if (pid && pid.length <= 0) {
                    arr.push(item);
                }
            } else {
                if (pid.length > 0 && String(pid.slice().pop()) == String(_id)) {
                    arr.push(item);
                }
            }
        });

        arr.map((item) => {
            item.children = [];
            //递归判断是否有子项菜单
            this.setMenuTree(data, item.children, item._id);
            if (item.children.length <= 0) {
                delete item.children;
            }
        });

        return arr;
    },
};