const tools = require("../utils/tools");
const CODE = require("../config/code");
const DeptModel = require("../models/dept");

class Dept {
    async list(ctx) {
        try {
            const { deptName } = ctx.request.query;
            const parmas = {};
            deptName && (parmas.deptName = new RegExp(deptName, "i"));
            const res = await DeptModel.aggregate([{
                    $match: parmas,
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "userId",
                        as: "user",
                    },
                },
                {
                    $unwind: "$user",
                },
                {
                    $project: {
                        userName: "$user.userName",
                        userEmail: "$user.userEmail",
                        userId: 1,
                        parentId: 1,
                        deptName: 1,
                        createdAt: 1,
                    },
                },
            ]);
            const treeData = tools.getTreeMenu(res);

            ctx.body = tools.success(treeData);
        } catch (error) {
            console.log(error);
        }
    }

    async operate(ctx) {
        try {
            const { action, _id, ...params } = ctx.request.body;
            let res, info;
            if (action == "add") {
                res = await DeptModel.create(params);
                info = "创建部门成功";
            } else if (action == "edit") {
                res = await DeptModel.findByIdAndUpdate(_id, params);
                info = "部门编辑成功";
            } else if (action == "delete") {
                res = await DeptModel.findByIdAndRemove(_id);
                await DeptModel.deleteMany({ parentId: { $all: [_id] } });

                info = "部门删除成功";
            } else {
                ctx.body = tools.fail("参数有误", CODE.DEPT.VERITY_PARMS_ERR);
            }
            ctx.body = tools.success(res, info);
        } catch (e) {
            console.log(e);
            ctx.app.emit("error", {
                error: e,
                data: "",
                msg: "部门操作失败",
                code: CODE.DEPT.OPERATE_ERR,
            });
        }
    }

    //所有部门
    async allList(ctx) {
        const res = await DeptModel.find().select(["_id", "deptName"]);
        ctx.body = tools.success(res);
    }
}

module.exports = new Dept();