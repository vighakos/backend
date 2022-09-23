require('dotenv').config()

var dbconf = {
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    database: process.env.DBNAME
}

module.exports = dbconf