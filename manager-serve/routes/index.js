const otherRouter = require("./other");
const userRouter = require("./users");
const menuRouter = require("./menu");
const roleRouter = require("./role");
const deptRouter = require("./dept");

function loadAppRouter(app) {
    app.use(userRouter.routes(), userRouter.allowedMethods());
    app.use(otherRouter.routes(), otherRouter.allowedMethods());
    app.use(menuRouter.routes(), menuRouter.allowedMethods());
    app.use(roleRouter.routes(), roleRouter.allowedMethods());
    app.use(deptRouter.routes(), deptRouter.allowedMethods());
}

module.exports = loadAppRouter;