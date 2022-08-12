const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// 菜单字段定义
const menuSchema = new Schema({
    menuType: {
        //菜单类型 1:菜单 2:按钮
        type: Number,
        default: 1,
    },
    menuName: String, //菜单名称
    menuCode: String, // 菜单标识符，只有按钮类型才有，用于确定按钮权限
    path: String, // 菜单路由
    icon: String, // 菜单图标
    component: String, //组件地址
    parentId: [Schema.Types.ObjectId], //父菜单ID
}, { timestamps: true }, { versionKey: false });

module.exports = mongoose.model("menu", menuSchema, "menus");