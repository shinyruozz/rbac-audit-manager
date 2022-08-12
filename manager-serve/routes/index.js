const userRouter = require("./users");
const otherRouter = require("./other");

function loadAppRouter(app) {
    app.use(userRouter.routes(), userRouter.allowedMethods());
    app.use(otherRouter.routes(), otherRouter.allowedMethods());
}

module.exports = loadAppRouter;