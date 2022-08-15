const router = require("koa-router")();
const leave = require("../controller/leave");

router.prefix("/leave");

router.get("/list", leave.leaveList);
router.post("/operate", leave.operate);
router.get("/count", leave.count);

module.exports = router;