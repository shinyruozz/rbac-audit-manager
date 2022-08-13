const router = require("koa-router")();
const menu = require("../controller/menu");

router.prefix("/menu");

router.post("/list", menu.menuList);
router.get("/allList", menu.allList);
router.post("/operate", menu.operate);

module.exports = router;