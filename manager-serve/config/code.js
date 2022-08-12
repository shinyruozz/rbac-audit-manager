module.exports = {
    SUCCESS: 200, //成功默认状态码
    FAIL: 400, //失败默认状态码
    USER: {
        VERITY_PARMS_ERR: 10001, // 用户参数有误
        VERITY_INFO_ERR: 10002, // 用户参数校验失败
        VERITY_USER: 10003, // 不存在用户
        LOGIN_ERR: 10004, //登录错误稍后重试
        VERITY_USER_EXIST: 10005, //用户存在
        OPERATE_ERR: 10006, //操作失败稍后重试
    },
    TOKEN_ERR: 50001,
    PARAMS_LACK: 40001, //缺少参数
};