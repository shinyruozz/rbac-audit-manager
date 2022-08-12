const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");
const log4js = require("./utils/log4js");

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
    // log4js.info("get params:" + ctx.request.query);
    log4js.info("post params:" + JSON.stringify(ctx.request.body));
    await next().catch((err) => {
        if (err.status == "401") {}
    });
});

// routes
require("./routes/index")(app);
// error-handling
app.on("error", ({ error, ...res }, ctx) => {
    log4js.error(error);
    ctx.body = res;
});

module.exports = app;