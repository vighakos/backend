require('dotenv').config()

var dbconf = {
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    database: process.env.DBNAME
}

var appconfig = {
    port: process.env.PORT,
    title: process.env.TITLE,
    company: process.env.COMPANY,
    author: process.env.AUTHOR
}

module.exports = {dbconf, appconfig}