require('dotenv').config()

var dbconf = {
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    database: process.env.DBNAME
}

var appconfig = {
    port: process.env.PORT
}

module.exports = {dbconf, appconfig}