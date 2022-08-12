const mongoose = require("mongoose");
const { mongo_url } = require("../config/db.config");
const log4js = require("../utils/log4js");

module.exports = () => {
    mongoose
        .connect(mongo_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then((res) => {
            log4js.info("数据库链接成功");
        })
        .catch((err) => {
            log4js.error("数据库链接失败" + err);
        });
};