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
};