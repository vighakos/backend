require('dotenv').config()
const { application } = require('express'),
    moment = require('moment'),
    cors = require('cors'),
    token = process.env.TOKEN,
    express = require('express'),
    ejs = require('ejs'),
    { MongoClient, ServerApiVersion, ObjectId } = require('mongodb'),
    server = express(),
    port = 5000

server.use(cors())
server.use(express.urlencoded({extended:true}))
server.use(express.json())

const uri = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@${process.env.DBHOST}/?retryWrites=true&w=majority`,
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

client.connect(err => {
    console.log('Connected to database');
    const database = client.db(process.env.DBNAME);

    server.post('/login', tokencheck(), (req, res) => {
        var table = req.body.table;
        var email = req.body.email;
        var passwd = req.body.password;
        let collection = database.collection(table)
    

        collection.find({$and:[{ "email": email, "passwd": passwd }]}).toArray()
            .then(results => { res.send(results) })
            .catch(err => { console.log(err); })
    });

    server.get('/:table', (req, res) => {
        let table = req.params.table
        let collection = database.collection(table)

        collection.find().toArray()
            .then(results => { 
                ejs.renderFile('public/index.ejs', {results}, (err, data) => {
                    if (err) res.send(err)
                    res.send(data)
                })
             })
            .catch(err => { console.log(err); })
    })
    
    server.get('/:table/:id', tokencheck(), (req, res) => {
        let table = req.params.table
        let collection = database.collection(table)
        let ID = req.params.id

        collection.find({"_id":ObjectId(ID)}).toArray()
            .then(results => { res.send(results) })
            .catch(err => { console.log(err); })
    })

    server.post('/:table', tokencheck(), (req, res) => {
        let table = req.params.table
        let collection = database.collection(table)
        let data = req.body

        collection.insertOne(data)
            .then(results => { res.send(results) })
            .catch(err => { console.log(err); })
    })

    server.patch('/:table/:id', tokencheck(), (req, res) => {
        let table = req.params.table
        let collection = database.collection(table)
        let ID = req.params.id
        let data = req.body

        collection.updateOne( {"_id":ObjectId(ID)}, {$set: data})
            .then(results => { res.send(results) })
            .catch(err => { console.log(err); })
    })

    server.delete('/:table', tokencheck(), (req, res) => {
        let table = req.params.table
        let collection = database.collection(table)

        collection.deleteMany({})
            .then(results => { res.send(results) })
            .catch(err => { console.log(err); })
    })

    server.get('/:table/:id', tokencheck(), (req, res) => {
        let table = req.params.table
        let collection = database.collection(table)
        let ID = req.params.id

        collection.deleteOne({ "_id": ObjectId(ID) })
            .then(results => { res.send(results) })
            .catch(err => { console.log(err); })
    })

    //client.close();
});

server.listen(port, () => { console.log(`Server listening on ${port}`) })

function tokencheck() {
    return (req, res, next) => {
        if (req.headers.authorization == token) {
            next();
        } else {
            res.status(500).json({ message: 'Illetéktelen hozzáférés!' });
        }
    };
}