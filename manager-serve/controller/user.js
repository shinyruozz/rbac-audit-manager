const tools = require("../utils/tools");
const CODE = require("../config/code");
const config = require("../config/index");
const UserModel = require("../models/user");
const jsonwebtoken = require("jsonwebtoken");
const CounterModel = require("../models/counter");
const MenuModel = require("../models/menu");
const RoleModel = require("../models/role");
const mongoose = require("mongoose");
//  set(val) {
//             console.log(res);
//             return res.sequence_value;
//         },

class User {
    async login(ctx) {
            try {
                const { userName, userPwd } = ctx.request.body;
                //用户名查找该用户是否存在
                const res = await UserModel.findOne({ userName }).select("+userPwd");
                if (!res) {
                    return (ctx.body = tools.fail(CODE.USER.VERITY_USER, "不存在该用户"));
                }
                //校验密码
                if (tools.decryptPwd(userPwd, res.userPwd)) {
                    let doc = res._doc;
                    //加密token
                    doc.token = jsonwebtoken.sign(doc, config.secret_key, { expiresIn: "1d" });
                    delete doc.userPwd;
                    return (ctx.body = tools.success(doc, "登录成功"));
                } else {
                    return (ctx.body = tools.fail(CODE.USER.VERITY_INFO_ERR, "账户或密码有误"));
                }
            } catch (error) {
                ctx.app.emit(
                    "error", {
                        error,
                        code: CODE.USER.LOGIN_ERR,
                        msg: "登录失败",
                    },
                    ctx
                );
            }
        }
        //注册和编辑
    async operate(ctx) {
        try {
            const { action, _id, ...params } = ctx.request.body;
            //注册
            if (action == "add") {
                const { userName, userPwd } = ctx.request.body;
                // 参数校验
                if (!userName || !userPwd) {
                    return (ctx.body = tools.fail(CODE.PARAMS_LACK, "缺少参数"));
                }
                if (!(userName.length >= 2 && userName.length <= 12) ||
                    !(userPwd.length >= 6 && userPwd.length <= 18)
                ) {
                    return (ctx.body = tools.fail(CODE.USER.VERITY_PARMS_ERR, "参数不合法"));
                }

                const isExist = await UserModel.findOne({ userName });
                if (isExist) {
                    ctx.body = tools.fail(CODE.USER.VERITY_USER_EXIST, "该用户已存在");
                    return;
                }
                params.userPwd = tools.encryptionPwd(params.userPwd);
                //每次id自增长
                const { sequence_value: userId } = await CounterModel.findOneAndUpdate({ sequence_name: "_id" }, { $inc: { sequence_value: 1 } }, { new: true });
                const res = await UserModel.create({
                    ...params,
                    userName,
                    userId,
                });

                ctx.body = tools.success({}, "注册成功");
            } else if (action == "edit") {
                //编辑
                const res = await UserModel.findByIdAndUpdate(_id, params);
                ctx.body = tools.success({}, "编辑成功");
            } else {
                throw new Error("action参数出错");
            }
        } catch (error) {
            console.log(error);
            ctx.app.emit(
                "error", {
                    error,
                    code: CODE.USER.OPERATE_ERR,
                    msg: "修改错误",
                },
                ctx
            );
        }
    }

    //删除用户/批量删除
    async delete(ctx) {
        const userIds = ctx.request.body.userIds;
        const res = await UserModel.deleteMany({
            userId: { $in: userIds },
        });
        ctx.body = tools.success({}, "删除成功");
    }

    // 返回全部用户
    async allList(ctx) {
        const res = await UserModel.find().select(["userId", "userName"]);
        ctx.body = tools.success(res, "获取用户列表成功");
    }

    async userList(ctx) {
            let { pageNum, pageSize, state, ...params } = ctx.request.body;
            if (state) {
                params.state = state;
            }
            //用户名模糊查询
            if (params.userName) params.userName = new RegExp(params.userName, "i");
            const { skip, pager } = tools.pager({ pageNum, pageSize });
            const query = UserModel.find(params, { __v: 0 }).sort({ createdAt: 1 });

            const res = await query.skip(skip).limit(pageSize);

            pager.total = await UserModel.countDocuments();
            ctx.body = tools.success({
                page: pager,
                list: res,
            });
        }
        //获取用户所属的权限列表
    async permission(ctx) {
        try {
            let { roleList, _id, role } = tools.decryptAuth(ctx.request.headers.authorization);
            let res, info, menuList, action;
            if (role == 0) {
                //用户是管理员
                menuList = await MenuModel.find();
                menuList = tools.getTreeMenu(menuList.slice());
                action = tools.getAction(JSON.parse(JSON.stringify(menuList)));
            } else {
                // 普通用户
                roleList = roleList.map((item) => {
                    //要转化 mongoose.Types.ObjectId 类型不让查询不到
                    return new mongoose.Types.ObjectId(item);
                });
                res = await RoleModel.aggregate([{
                        $match: { _id: { $in: roleList } },
                    },
                    {
                        $lookup: {
                            from: "menus",
                            localField: "permissionList.checkedKeys",
                            foreignField: "_id",
                            as: "checkedKeys",
                        },
                    },
                    {
                        $lookup: {
                            from: "menus",
                            localField: "permissionList.halfCheckedKeys",
                            foreignField: "_id",
                            as: "halfCheckedKeys",
                        },
                    },
                    {
                        $project: {
                            menuList: { $setUnion: ["$halfCheckedKeys", "$checkedKeys"] }, //合并一起
                            action: "$checkedKeys",
                        },
                    },
                ]);
                // 合并  默认是[{_id:[menuList....]}....]  合并成 [ {menuItem},{menuItem}]
                menuList = res.reduce((pre, cur, index) => {
                    return pre.concat(cur.menuList);
                }, []);
                action = res.reduce((pre, cur, index) => {
                    return pre.concat(cur.action);
                }, []);
                // 去重 不同角色可能有菜单一样的情况
                menuList = menuList.filter((menuItem, index, arr) => {
                    let cuIdx = arr.findIndex((item) => {
                        return String(menuItem._id) == String(item._id);
                    });
                    return cuIdx == index;
                });
                menuList = tools.getTreeMenu(menuList);
                action = action
                    .filter((menuItem, index, arr) => {
                        let cuIdx = arr.findIndex((item) => {
                            return String(menuItem._id) == String(item._id);
                        });
                        return cuIdx == index;
                    })
                    .map((item) => item.menuCode);
            }
            info = "获取菜单列表成功";
            ctx.body = tools.success({
                    menuList,
                    action, //格式为['user-add','user-delete'.....]
                },
                info
            );
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new User();