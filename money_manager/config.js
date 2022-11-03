require('dotenv').config();

let dbconfig = {
    connectionLimit: process.env.DBLIMIT,
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME
}

let appconfig = {
    port: process.env.PORT,
    company: process.env.COMPANY,
    author: process.env.AUTHOR,
    title: process.env.TITLE
}

module.exports = { dbconfig, appconfig }