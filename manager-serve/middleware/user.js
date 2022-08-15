const CODE = require("../config/code");
const tools = require("../utils/tools");

// 校验参数合法性

async function verityParams(ctx, next) {
    try {
        const { userName, userPwd } = ctx.request.body;
        if (!userName || !userPwd) {
            return (ctx.body = tools.fail(CODE.PARAMS_LACK, "缺少参数"));
        }
        if (!(userName.length >= 2 && userName.length <= 12) || !(userPwd.length >= 6 && userPwd.length <= 18)) {
            return (ctx.body = tools.fail(CODE.USER.VERITY_PARMS_ERR, "参数不合法"));
        }

        await next();
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    verityParams,
};