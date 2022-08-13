const router = require("koa-router")();
const menu = require("../controller/menu");

router.prefix("/menu");

router.post("/list", menu.menuList);
router.post("/operate", menu.operate);

module.exports = router;