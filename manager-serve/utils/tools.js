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
};