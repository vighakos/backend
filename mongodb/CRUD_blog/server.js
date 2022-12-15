require('dotenv').config();
const express = require('express');
const moment = require('moment');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const ejs = require('ejs');
const axios = require('axios');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = 5000;
const token = process.env.TOKEN;
const version = process.env.VERSION;
const debug = process.env.DEBUG;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var pug = require('pug');
var fn = pug.compile('string of pug', options);
var html = fn(locals);

// Image file Upload settings
var storage = multer.diskStorage({
    destination: '../Public/uploads/',
    filename: function(req, file, cb) {
        let file_name = file.originalname.replace(path.extname(file.originalname), "") + '-' + Date.now() + path.extname(file.originalname);
        cb(null, file_name);
    }
});

var upload = multer({ storage: storage });

const uri = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@${process.env.DBHOST}/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    console.log('Connected to MongoDB Database...');
    const database = client.db(process.env.DBNAME);

    app.get('/', (req, res) => {

        axios.get('http://localhost:5000/blogs').then(function(results) {
            console.log(results)
            ejs.renderFile('views/blogs.ejs', { blogs: results.data }, (err, data) => {
                res.send(data);
            })
        });

    });




    // file upload
    app.post('/fileUpload', upload.single('file'), (req, res) => {
        log(req.socket.remoteAddress, `1 File uploaded to /Public/uploads (${req.file.filename}`);
        res.status(200).json(req.file);
    });

    // GET VERSION INFO
    app.get('/', (req, res) => {
        log(req.socket.remoteAddress, `Sent version information.`);
        res.status(200).send(`2/14.szft Backend MongoDB API ${version}.`);
    });

    // LOGINCHECK
    app.post('/login', tokencheck(), (req, res) => {
        var table = req.body.table;
        var email = req.body.email;
        var passwd = req.body.password;
        let collection = database.collection(table);

        //TODO: tesztelni kell!
        collection.find({ $and: [{ "email": email }, { 'passwd': passwd }] }).toArray()
            .then(results => {
                log(req.socket.remoteAddress, `${results.length} records sent form ${table} table (logincheck).`);
                res.send(results);
            })
            .catch(error => {
                log(req.socket.remoteAddress, error);
                res.send(error);
            });
    });

    // GET ALL RECORDS
    app.get('/:table', tokencheck(), (req, res) => {
        let table = req.params.table;
        let collection = database.collection(table);
        collection.find().toArray()
            .then(results => {
                log(req.socket.remoteAddress, `${results.length} records sent form ${table} table.`);
                res.send(results);
            })
            .catch(error => {
                log(req.socket.remoteAddress, error);
                res.send(error);
            });
    });

    // GET ONE RECORD BY ID
    app.get('/:table/:id', tokencheck(), (req, res) => {
        let ID = req.params.id;
        let table = req.params.table;
        let collection = database.collection(table);
        collection.find({ "_id": ObjectId(ID) }).toArray()
            .then(results => {
                log(req.socket.remoteAddress, `${results.length} record sent form ${table} table.`);
                res.send(results);
            })
            .catch(error => {
                log(req.socket.remoteAddress, error);
                res.send(error);
            });
    });

    // GET RECORDS BY field
    app.get('/:table/:field/:value', tokencheck(), (req, res) => {
        var table = req.params.table;
        var field = req.params.field;
        var value = req.params.value;
        let collection = database.collection(table);
        let felt = `{
            "${field}":"${value}"
        }`;
        collection.find(JSON.parse(felt)).toArray()
            .then(results => {
                log(req.socket.remoteAddress, `${results.length} record sent form ${table} table.`);
                res.send(results);
            })
            .catch(error => {
                log(req.socket.remoteAddress, error);
                res.send(error);
            });
    });

    // INSERT RECORD
    app.post('/:table', tokencheck(), (req, res) => {
        let table = req.params.table;
        let collection = database.collection(table);
        let data = req.body;
        collection.insertOne(data)
            .then(results => {
                log(req.socket.remoteAddress, `1 record inserted to ${table} table.`);
                res.send(results)
            })
            .catch(error => {
                log(req.socket.remoteAddress, error);
                res.send(error);
            });
    });

    // UPDATE RECORD BY ID
    app.patch('/:table/:id', tokencheck(), (req, res) => {
        let table = req.params.table;
        let collection = database.collection(table);
        let blogID = req.params.id;
        let data = req.body;
        collection.updateOne({ "_id": ObjectId(blogID) }, { $set: data })
            .then(results => {
                log(req.socket.remoteAddress, `${results.modifiedCount} record updated in ${table} table.`);
                res.send(results);
            })
            .catch(error => {
                log(req.socket.remoteAddress, error);
                res.send(error);
            });
    });

    // DELETE ALL RECORDS
    app.delete('/:table', tokencheck(), (req, res) => {
        let table = req.params.table;
        let collection = database.collection(table);
        collection.deleteMany({})
            .then(results => {
                log(req.socket.remoteAddress, `${results.deletedCount} record deleted form ${table} table.`);
                res.send(results)
            })
            .catch(error => {
                log(req.socket.remoteAddress, error);
                res.send(error);
            });
    });

    // DELETE ONE RECORD BY ID
    app.delete('/:table/:id', tokencheck(), (req, res) => {
        let ID = req.params.id;
        let table = req.params.table;
        let collection = database.collection(table);
        collection.deleteOne({ "_id": ObjectId(ID) })
            .then(results => {
                log(req.socket.remoteAddress, `${results.deletedCount} record deleted form ${table} table.`);
                res.send(results)
            })
            .catch(error => {
                log(req.socket.remoteAddress, error);
                res.send(error);
            });
    });

    // DELETE RECORDS BY field
    app.delete('/:table/:field/:value', tokencheck(), (req, res) => {
        var table = req.params.table;
        var field = req.params.field;
        var value = req.params.value;
        let collection = database.collection(table);
        let felt = `{
                "${field}":"${value}"
            }`;
        collection.deleteMany(JSON.parse(felt)).toArray()
            .then(results => {
                log(req.socket.remoteAddress, `${results.length} record deleted form ${table} table.`);
                res.send(results);
            })
            .catch(error => {
                log(req.socket.remoteAddress, err);
                res.send(error);
            });
    });

    // client.close();
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});

// MIDDLEVARE FUNCTIONS

function tokencheck() {

    return (req, res, next) => {
        /*    if (req.headers.authorization == token) {
              next();
          } else {
              res.status(500).json({ message: 'Illetéktelen hozzáférés!' });
          }
          */
        next();
    };

}

function log(req, res) {
    if (debug == 1) {
        var timestamp = moment(new Date()).format('yyyy-MM-DD HH:mm:ss');
        console.log(`[${timestamp}] : ${req} >>> ${res}`);
    }
}