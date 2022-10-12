require('dotenv').config()

var dbconf = {
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    database: process.env.DBNAME
}

var appconfig = {
    port: process.env.PORT,
    company: process.env.company,
    author: process.env.author,
    title: process.env.title
}

module.exports = {dbconf, appconfig}