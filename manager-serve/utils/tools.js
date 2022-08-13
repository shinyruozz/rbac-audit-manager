const CODE = require("../config/code");
const config = require("../config/index");
const bcrypt = require("bcryptjs");

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

function pager({ pageNum, pageSize }) {
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

//加密密码
function encryptionPwd(pwd) {
    return bcrypt.hashSync(pwd, config.SALT);
}

//密码比对
function decryptPwd(pwd, hash) {
    return bcrypt.compareSync(pwd, hash);
}

module.exports = {
    success,
    fail,
    pager,
    encryptionPwd,
    decryptPwd,
    getTreeMenu,
};