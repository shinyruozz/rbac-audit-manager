const mongoose = require("mongoose");

const Schema = mongoose.Schema;
// 用户字段定义
const userSchema = new Schema({
    userId: {
        type: Number,
    }, // 用户id
    userName: {
        type: String,
        unique: true,
        min: 2,
        max: 12,
    }, // 用户名
    userPwd: {
        //密码
        type: String,
        min: 6,
        max: 18,
        select: false,
    },
    userEmail: String, // 邮箱
    mobile: String, // 手机
    sex: {
        //性别
        type: Number,
        eume: [0, 1],
        default: 0, //0:男  1：女
    },
    deptId: [
        // 部门
        {
            type: Schema.Types.ObjectId,
        },
    ],
    job: String,
    state: {
        type: Number, // 1: 在职 2: 离职 3: 试用期
        default: 1,
    },
    role: {
        // 用户角色 0：系统管理员  1： 普通用户
        type: Number,
        default: 0,
    },
    roleList: [{
        //系统角色
        type: Schema.Types.ObjectId,
    }, ],
    lastLoginTime: {
        //最后一次登录
        type: Date,
        default: Date.now(),
    },
    remark: String, //备注
}, { timestamps: true }, { versionKey: false });

module.exports = mongoose.model("user", userSchema, "users");