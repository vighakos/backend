const express = require('express'),
    server = express(),
    port = 3000,
    db = require('./models')


db.sequelize.sync()

server.get('/users', (req, res) => {
    db.models.User.findAll().then(users => {
        res.send(users)
    })
})

server.get('/products', (req, res) => {
    db.models.Product.findAll().then(products => {
        res.send(products)
    })
})

server.get('/users/new', (req, res) => {
    db.models.User.create({
        firstName: "Jane",
        lastName: "Doe",
        age: 25
    }).then(
        res.send('Record inserted!')
    )
})

server.get('/products/new', (req, res) => {
    db.models.Product.create({
        category: "etel",
        productName: "tej",
        amount: 25,
        price: 1200,
        link: "milk",
        stat: 1
    }).then(
        res.send('Record inserted!')
    )
})

server.get('/products/edit/:id', (req, res) => {
    let ID = req.params.id
    db.models.Product.update({
        category: "slave",
        productName: "human",
        amount: 5
    }, {
        where: { id: ID}
    }).then(products => {
        res.send(products)
    })
})

server.get('/products/del/:id', (req, res) => {
    let ID = req.params.id
    db.models.Product.destroy({
        where: { id: ID}
    }).then(products => {
        res.send(products)
    })
})

server.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
})