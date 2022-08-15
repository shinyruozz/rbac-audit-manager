const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// 部门字段定义

const deptSchema = new Schema({
    parentId: [Schema.Types.ObjectId], //父对象Id，一级部门默认为null
    deptName: String, //部门名称
    userId: {
        type: Number,
        // ref: "users",
    }, //  负责人id
}, { timestamps: true, versionKey: false });

deptSchema.virtual("userInfo", {
    ref: "user",
    localField: "userId",
    foreignField: "userId",
    justOne: true,
});

deptSchema.set("toObject", { virtuals: true });
deptSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("dept", deptSchema, "depts");