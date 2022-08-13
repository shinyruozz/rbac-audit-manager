const tools = require("../utils/tools");
const CODE = require("../config/code");
const MenuModel = require("../models/menu");

class Menu {
    //返回菜单列表
    async menuList(ctx) {
        const params = ctx.request.body;

        //模糊匹配
        if (params && params.menuName) {
            params.menuName = new RegExp(params.menuName, "i");
        }
        if (params && params.menuName == "") {
            delete params.menuName;
        }

        let res = await MenuModel.find(params);
        let treeMenu = tools.getTreeMenu(res, []);
        ctx.body = tools.success(treeMenu);
    }

    async operate(ctx) {
        const { action, _id, ...params } = ctx.request.body;
        let info = "",
            res;
        if (action == "add") {
            res = await MenuModel.create(params);
            info = "创建成功";
        } else if (action == "edit") {
            res = await MenuModel.findByIdAndUpdate(_id, params);
            info = "编辑成功";
        } else if (action == "delete") {
            res = await MenuModel.findOneAndRemove(_id);
            //同事删除子项目
            await MenuModel.deleteMany({ parentId: { $all: [_id] } });
            info = "删除成功";
        } else {
            ctx.body = tools.fail(CODE.MENU.VERITY_PARMS_ERR);
            return;
        }

        ctx.body = tools.success(res, info);
    }

    //返回菜单列表 不做树形结构
    async allList(ctx) {
        const res = await MenuModel.find().select(["_id", "menuName", "parentId"]);
        ctx.body = tools.success(res);
    }
}

module.exports = new Menu();