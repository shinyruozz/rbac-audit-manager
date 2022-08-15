const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// 菜单字段定义
const roleSchema = new Schema({
    roleName: String, //角色名称
    remark: String, // 备注
    permissionList: {
        checkedKeys: [{
            type: Schema.Types.ObjectId,
            ref: "menus",
        }, ], //选中的子菜单(最后一层)
        halfCheckedKeys: [{
            type: Schema.Types.ObjectId,
            ref: "menus",
        }, ], //半选中的父菜单
    },
}, { timestamps: true }, { versionKey: false });

module.exports = mongoose.model("role", roleSchema, "roles");