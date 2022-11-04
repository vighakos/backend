module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        firstName: {
          type: DataTypes.STRING,
          allowNull: false
        },
        lastName: {
          type: DataTypes.STRING
        },
        age: {
            type: DataTypes.INTEGER
        }
      }, {
        tableName: 'users'
    });
    return User
}