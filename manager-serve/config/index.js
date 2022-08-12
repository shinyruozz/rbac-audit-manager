const bcrypt = require("bcryptjs");

const secret_key = "c@z$m1.5544sskk";
const SALT = bcrypt.hashSync(secret_key, 10); // 加密后的盐

module.exports = {
    secret_key,
    SALT,
};