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

async function run(){
try{
    await client.connect();
    const ProductCollection = client.db('emaZone').collection('product');

    app.get('/product', async (req, res)=>{
        const page =parseInt(req.query.page)
        const size =parseInt(req.query.size)
        const query ={}
        const cursor = ProductCollection.find(query);
        let product;
        if(page || size){
            Products =await cursor.skip(page*size).limit(size).toArray();
        }
        else{
            Products =await cursor.toArray();
        }
        res.send(Products)
    })
    app.get('/productcount', async (req, res)=>{
        // const query ={}
        // const cursor = ProductCollection.find(query);

        const count =await ProductCollection.estimatedDocumentCount();
        res.send({count})

        app.post('/productBykeys', async (req, res)=>{
            const keys =req.body;
            const ids = keys.map(id=>Object(id))
            const query ={_id:{$in: ids}}
            const cursor = ProductCollection.find(query);
            Products =await cursor.toArray();
            res.send(Products)
            console.log(keys)
        } )
    })
}
finally{

}
}
run().catch(console.dir);
app.get('/', (req, res) =>{
    res.send('amajhon is running')
})

app.listen(port, ()=>{
    console.log('jhon is running at port:', port)
})