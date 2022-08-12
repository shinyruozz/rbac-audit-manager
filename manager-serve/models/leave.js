const mongoose = require("mongoose");
const Schema = mongoose.Schema;

orderNo;
// 菜单字段定义
const menuSchema = new Schema({
    orderNo: String, // 申请单号
    applyType: {
        //申请类型  1:事假 2：调休 3:年假
        type: Number,
        default: 1,
    },
    startTime: { type: Date, default: Date.now }, //开始时间
    endTime: { type: Date, default: Date.now }, //结束时间
    applyUser: {
        //申请人信息
        userId: String,
        userName: String,
        userEmail: String,
    },
    leaveTime: String, //休假时间
    reasons: String, //休假原因
    auditUsers: String, //完整审批人流程 -> a,b,c
    curAuditUserName: String, //当前审批人
    auditFlows: [{
        //审批流
        userId: Number,
        userName: String,
        userEmail: String,
    }, ],
    auditLogs: [{
        //审批日志
        userId: String,
        userName: String,
        createTime: Date,
        remark: String,
        action: String,
    }, ],
    applyState: {
        //审批状态 1:待审批 2:审批中 3:审批拒绝 4:审批通过 5:作废
        type: Number,
        default: 1,
    },
}, { timestamps: true }, { versionKey: false });

module.exports = mongoose.model("menu", menuSchema, "menus");