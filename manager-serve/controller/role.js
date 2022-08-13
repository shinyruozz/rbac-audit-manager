const tools = require("../utils/tools");
const CODE = require("../config/code");
const RoleModel = require("../models/role");

class Role {
    async roleList(ctx) {
        const { pageNum, pageSize, ...params } = ctx.request.query;
        const { skip, pager } = tools.pager({ pageNum, pageSize });
        if (params.roleName) {
            params.roleName = new RegExp(params.roleName);
        }
        const query = RoleModel.find(params);

        const data = await query.skip(skip).limit(pageSize);
        pager.total = await RoleModel.countDocuments();
        ctx.body = tools.success({
            page: pager,
            data,
        });
    }

    async roleAllList(ctx) {
        const res = await RoleModel.find().select(["_id", "roleName"]);
        ctx.body = tools.success(res, "获取角色所有列表成功");
    }

    async operate(ctx) {
        const { action, _id, ...params } = ctx.request.body;
        let res, info;
        try {
            if (action == "add") {
                res = await RoleModel.create(params);
                info = "创建角色成功";
            } else if (action == "edit") {
                res = await RoleModel.findByIdAndUpdate(_id, params);
                info = "修改角色成功";
            } else if (action == "delete") {
                res = await RoleModel.findByIdAndRemove(_id);
                info = "删除成功";
            } else {
                ctx.body = tools.fail(CODE.ROLE.VERITY_PARMS_ERR, "参数有误");
            }

            ctx.body = tools.success(res, info);
        } catch (error) {
            ctx.app.emit("error", {
                error,
                msg: "操作失败",
                code: CODE.ROLE.OPERATE_ERR,
                data: {},
            });
        }
    }

    async updatePermission(ctx) {
        try {
            const { _id, ...params } = ctx.request.body;

            const res = await RoleModel.findByIdAndUpdate(_id, params);

            ctx.body = tools.success(res);
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new Role();