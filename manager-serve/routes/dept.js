const Router = require("koa-router");
const dept = require("../controller/dept");

const router = new Router({ prefix: "/dept" });

router.get("/allList", dept.allList);
router.get("/list", dept.list);
router.post("/operate", dept.operate);

module.exports = router;