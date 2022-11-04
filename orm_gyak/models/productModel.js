module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        category: {
          type: DataTypes.STRING
        },
        productName: {
          type: DataTypes.STRING
        },
        amount: {
            type: DataTypes.INTEGER
        },
        price: {
            type: DataTypes.DOUBLE
        },
        link: {
            type: DataTypes.STRING
        },
        stat: {
            type: DataTypes.BOOLEAN
        },
      }, {
        tableName: 'products'
    });
    return Product
}