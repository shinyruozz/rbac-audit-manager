const CODE = require("../config/code");
const config = require("../config/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function success(data = {}, msg = "请求成功", code = CODE.SUCCESS) {
    return {
        data,
        msg,
        code,
    };
}

function fail(code = CODE.FAIL, msg = "请求失败", data = "") {
    return {
        data,
        msg,
        code,
    };
}

function pager({ pageNum = 1, pageSize = 10 }) {
    pageNum = Number(pageNum);
    pageSize = Number(pageSize);
    let skip = (pageNum - 1) * pageSize;
    return {
        skip,
        pager: {
            pageNum,
            pageSize,
        },
    };
}
//格式化日期
function dateFormat(date, rule) {
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
}
//递归菜单树形结构
function getTreeMenu(data, list, _id) {
    let arr = list || [];

    for (let i = 0; i < data.length; i++) {
        let item = data[i]._doc ? data[i]._doc : data[i];
        //为最外层父级菜单
        if (!_id) {
            if (item.parentId && item.parentId.length == 0) {
                arr.push(item);
            }
        } else {
            if (String(item.parentId.slice().pop()) == String(_id)) {
                arr.push(item);
            }
        }
    }
    arr.map((item) => {
        item.children = [];
        getTreeMenu(data, item.children, item._id);
        if (item.children.length == 0) {
            delete item.children;
        } else if (item.children[0].menuType == 2) {
            item.action = item.children;
        }
    });

    return arr.length > 0 ? arr : data;
}

//解密token
function decryptAuth(auth) {
    if (!auth) return null;

    const token = auth.split(" ")[1];
    return jwt.verify(token, config.secret_key);
}

//加密密码
function encryptionPwd(pwd) {
    return bcrypt.hashSync(pwd, config.SALT);
}

//密码比对
function decryptPwd(pwd, hash) {
    return bcrypt.compareSync(pwd, hash);
}

function getAction(list) {
    let actionList = [];
    const deep = (arr) => {
        while (arr.length) {
            let item = arr.pop();
            if (item.action) {
                item.action.map((action) => {
                    actionList.push(action.menuCode);
                });
            }
            if (item.children && !item.action) {
                deep(item.children);
            }
        }
    };
    deep(list);
    return actionList;
}

module.exports = {
    success,
    fail,
    pager,
    encryptionPwd,
    decryptPwd,
    getTreeMenu,
    dateFormat,
    decryptAuth,
    getAction,
};