const { application } = require('express');
const moment = require('moment');

const express = require('express'),
    { MongoClient, ServerApiVersion, ObjectId } = require('mongodb'),
    server = express(),
    port = 5000

server.use(express.urlencoded({extended:true}))

const uri = "mongodb+srv://vighakos:asd123@xd.g2xsjai.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    console.log('Connected to database');
    const blogs = client.db("CRUD_blog").collection("blogs");

    server.get('/blogs', (req, res) => {
        blogs.find().toArray()
            .then(results => {
                res.send(results)
            })
            .catch(err => { console.log(err); })
    })
    
    server.get('/blogs/:id', (req, res) => {
        let blogID = req.params.id
        blogs.find({"_id":ObjectId(blogID)}).toArray()
            .then(results => {
                res.send(results)
            })
            .catch(err => { console.log(err); })
    })

    server.post('/blogs', (req, res) => {
        let data = {
            title: req.body.title,
            description: req.body.description,
            date: moment(new Date()).format('YYY-MM-DD H:m:s')
        }
        blogs.insertOne(data)
            .then(results => {
                res.send(results)
            })
            .catch(err => { console.log(err); })
    })

    //client.close();
});

server.listen(port, () => { console.log(`Server listening on ${port}`) })