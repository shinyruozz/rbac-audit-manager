module.exports = {
    SUCCESS: 200, //成功默认状态码
    FAIL: 400, //失败默认状态码
    USER: {
        VERITY_PARMS_ERR: 10101, // 用户参数有误
        VERITY_INFO_ERR: 10102, // 用户参数校验失败
        VERITY_USER: 10103, // 不存在用户
        LOGIN_ERR: 10104, //登录错误稍后重试
        VERITY_USER_EXIST: 10105, //用户存在
        OPERATE_ERR: 10106, //操作失败稍后重试
    },
    MENU: {
        VERITY_PARMS_ERR: 10201, //参数错误
    },
    ROLE: {
        VERITY_PARMS_ERR: 10301, //参数信息错误
        OPERATE_ERR: 10306, //操作失败
    },
    DEPT: {
        VERITY_PARMS_ERR: 10401, //参数信息错误
        OPERATE_ERR: 10406, //操作失败
    },
    TOKEN_ERR: 50001,
    PARAMS_LACK: 40001, //缺少参数
};