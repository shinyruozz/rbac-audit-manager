const router = require("koa-router")();
const user = require("../controller/user");
const { verityParams } = require("../middleware/user");

router.prefix("/users");

router.post("/login", verityParams, user.login);
router.post("/operate", user.operate);
router.post("/delete", user.delete);
router.get("/all/list", user.allList);
router.post("/list", user.userList);

module.exports = router;