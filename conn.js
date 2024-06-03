const mysql = require('mysql');
const util = require('util');
const dotenv = require('dotenv');
dotenv.config();
var conn = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
});
conn.connect(function (error) {
    if (error) {
        throw error;
    } else {
        console.log('MySQL Database is connected successfully');
    }
});
var exe = util.promisify(conn.query).bind(conn);
module.exports = exe;