const mongoose = require("mongoose");

const Schema = mongoose.Schema;
// 用户字段定义
const counterSchema = new Schema({
    sequence_name: String, //增长字段
    sequence_value: Number, //增长值 每次加1
}, { versionKey: false });

module.exports = mongoose.model("counter", counterSchema, "counters");