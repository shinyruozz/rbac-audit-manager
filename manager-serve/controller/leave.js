const tools = require("../utils/tools");
const CODE = require("../config/code");
const LeaveModel = require("../models/leave");
const DeptModel = require("../models/dept");

class Leave {
    //返回菜单列表
    async leaveList(ctx) {
        try {
            let { applyState, pageNum, pageSize, action } = ctx.request.query;
            const { skip, pager } = tools.pager({ pageNum, pageSize });
            const userInfo = tools.decryptAuth(ctx.request.headers.authorization);
            let params = {};
            if (applyState != 0) params.applyState = applyState;
            if (action == "approve") {
                params["auditFlows.userId"] = userInfo.userId;
            } else {
                //查找自己休假申请信息
                params["applyUser.userId"] = userInfo.userId;
                // params = {
                //     "applyUser.userId": userInfo.userId,
                // };
            }
            const query = LeaveModel.find(params);
            const list = await query.skip(skip).limit(pageSize);
            const total = await LeaveModel.countDocuments(params);
            pager.total = total;
            ctx.body = tools.success({
                list,
                page: pager,
            });
        } catch (error) {
            console.log(error);
            ctx.app.emit("error", {
                error,
                ...tools.fail(CODE.LEAVE.GET_LEAVE_ERR, "获取审核列表失败"),
            });
        }
    }

    async count(ctx) {
        const params = {};
        const { userName } = tools.decryptAuth(ctx.request.headers.authorization);
        params.curAuditUserName = userName; //当前审批人是自己
        params.$or = [{ applyState: 1 }, { applyState: 2 }];
        const count = await LeaveModel.countDocuments(params);
        ctx.body = tools.success(count || 0);
    }

    async operate(ctx) {
        try {
            const { action, _id, remark, ...params } = ctx.request.body;
            let info = "",
                res;
            const { userId, userName, userEmail, deptId } = tools.decryptAuth(ctx.request.headers.authorization) || {};
            //申请休假
            if (action == "add") {
                params.orderNo = "XJ" + tools.dateFormat(Date.now(), "yyyyMMdd");
                params.applyUser = { userId, userName, userEmail };
                const curdeptId = deptId.length > 0 ? deptId.slice().pop() : null;
                const { userInfo } = await DeptModel.findById(curdeptId).populate("userInfo"); // 用户所属部门信息
                if (!userInfo) {
                    ctx.body = tools.fail(400, "没有部门负责人");
                    return;
                }
                let auditUsers = userInfo.userName; //完整审批人
                let auditFlows = [
                    { userName: userInfo.userName, userEmail: userInfo.userEmail, userId: userInfo.userId },
                ];
                //当前用户的审批人
                params.curAuditUserName = userInfo.userName;
                //人事部门 财务部门 为后两级审核
                const audits = await DeptModel.aggregate([{
                        $match: { deptName: { $in: ["人事部门", "财务部门"] } },
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
                        $project: { userId: 1, userEmail: "$user.userEmail", userName: "$user.userName" },
                    },
                ]);
                audits.map((item) => {
                    let { userName, userEmail, userId } = item;
                    auditUsers = auditUsers + "," + userName;
                    auditFlows.push({ userName, userEmail, userId });
                });
                params.auditUsers = auditUsers;
                params.auditFlows = auditFlows;

                res = await LeaveModel.create(params);
                info = "创建成功";
            } else if (action == "refuse") {
                //驳回
                res = await LeaveModel.findByIdAndUpdate(_id, {
                    applyState: 3,
                });
                res.auditLogs.push({
                    userId,
                    userName,
                    createTime: new Date(),
                    remark,
                    action: "审核拒绝",
                });
                await res.save();
                info = "驳回成功";
            } else if (action == "pass") {
                //通过
                const applyInfo = await LeaveModel.findById(_id),
                    logsLeng = applyInfo.auditLogs.length,
                    auditFlows = applyInfo.auditFlows;

                if (applyInfo.auditFlows.length == logsLeng + 1) {
                    // 审核同意
                    applyInfo.applyState = 4;
                    applyInfo.curAuditUserName = "无";
                } else if (applyInfo.auditFlows.length > logsLeng + 1) {
                    // 还没到最后一位审核
                    applyInfo.applyState = 2;
                    //修改为下一个审批人
                    applyInfo.curAuditUserName = auditFlows[logsLeng + 1].userName;
                } else {
                    ctx.body = tools.fail(400, "审核已同意请勿重试"); // 意外处理
                    return;
                }

                applyInfo.auditLogs.push({
                    userId,
                    userName,
                    createTime: new Date(),
                    remark,
                    action: "审核通过",
                });
                res = await applyInfo.save();

                info = "审核通过";
            } else if (action == "delete") {
                //作废
                res = await LeaveModel.findByIdAndUpdate(_id, { applyState: 5 });
                info = "作废成功";
            } else {
                ctx.body = tools.fail(CODE.MENU.VERITY_PARMS_ERR);
                return;
            }

            ctx.body = tools.success(res, info);
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new Leave();