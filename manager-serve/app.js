const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");
const log4js = require("./utils/log4js");
const koajwt = require("koa-jwt");
const config = require("./config/index");
const CODE = require("./config/code");

require("./utils/db.js")(); // 链接数据库

// error handler
onerror(app);

// middlewares
app.use(
    bodyparser({
        enableTypes: ["json", "form", "text"],
    })
);
app.use(json());
app.use(logger());
app.use(require("koa-static")(__dirname + "/public"));

app.use(
    views(__dirname + "/views", {
        extension: "pug",
    })
);

// logger 日志
app.use(async(ctx, next) => {
    log4js.info("get params:" + JSON.stringify(ctx.request.query));
    log4js.info("post params:" + JSON.stringify(ctx.request.body));
    await next().catch((err) => {
        //token认证失败
        if (err.status == "401") {
            console.log(err);
            ctx.status = 200;
            ctx.body = {
                code: CODE.TOKEN_ERR,
                msg: "token认证失败",
                data: "",
            };
        }
    });
});
app.use(
    koajwt({ secret: config.secret_key }).unless({
        path: [/^\/users\/login/],
    })
);

// routes
require("./routes/index")(app);
// error-handling
app.on("error", ({ error, ...res }, ctx) => {
    log4js.error(error);
    ctx.body = res;
});

module.exports = app;