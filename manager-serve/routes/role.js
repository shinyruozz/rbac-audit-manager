const router = require("koa-router")();
const role = require("../controller/role");

router.prefix("/roles");
//根据分类信息查询
router.get("/list", role.roleList);
//查询所有角色
router.get("/allList", role.roleAllList);
//角色增删改
router.post("/operate", role.operate);
//用户权限的修改
router.post("/update/permission", role.updatePermission);

module.exports = router;