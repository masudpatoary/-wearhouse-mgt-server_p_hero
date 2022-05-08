const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_KEY}@cluster0.offi7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productCollection = client.db('rolls-royce-parts').collection('spare-parts');

        app.get('/product', async (req, res) => {
            const page = parseInt(req.query.page)
            const size = parseInt(req.query.size)
            const query = {}
            const cursor = productCollection.find(query);
            Products = await cursor.toArray();
            res.send(Products)
        })
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query);
            res.send(product);
            console.log(id)
        });
        app.post('/product', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct)
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        });
        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            console.log(id)
            res.send(result);
        });

        app.put('/product/:id', async (req, res) => {
            const id = req.params.id;
            const updatedQty = req.body.quantity;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: updatedQty
                }
            }
            const result = await productCollection.updateOne(filter, updatedDoc, options);
            console.log(updatedQty)
            res.send(result);
        })
    }
    finally {

    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Core inventory mgt')
})

app.listen(port, () => {
    console.log('Core inventory mgt is running at port:', port)
})