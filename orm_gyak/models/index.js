const Sequelize = require('sequelize');

const sequelize = new Sequelize('214szft_orm', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

const db = {}
db.sequelize = sequelize;
db.models = {}
db.models.User = require('./userModel.js')(sequelize, Sequelize.DataTypes)
db.models.Product = require('./productModel.js')(sequelize, Sequelize.DataTypes)

module.exports = db