const otherRouter = require("./other");
const userRouter = require("./users");
const menuRouter = require("./menu");

function loadAppRouter(app) {
    app.use(userRouter.routes(), userRouter.allowedMethods());
    app.use(otherRouter.routes(), otherRouter.allowedMethods());
    app.use(menuRouter.routes(), menuRouter.allowedMethods());
}

module.exports = loadAppRouter;