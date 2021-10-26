const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const { response } = require('express');
const app = express();

const ObjectId = require('mongodb').ObjectId;


const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DATA_USER}:${process.env.DATA_PASS}@cluster0.vxr0x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('PracticeProducts');
        const productsCollection = database.collection('products');

        // GET all Products
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });

        // GET one items
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.findOne(query);
            // console.log(result)
            res.json(result);
        })

        // POST API
        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            // console.log(result)
            res.json(result)
        });


        // UPDATE API
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const updatedProduct = req.body;
            console.log(updatedProduct)
            const options = { upsert: true };
            const query = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    productName: updatedProduct.productName,
                    price: updatedProduct.price
                },
            };
            const result = await productsCollection.updateOne(query, updateDoc, options)
            res.json(result);
        })

        // DELETE API
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            console.log(result)
            res.json(result);
        });
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('running practice server');
});

app.listen(port, () => {
    console.log('listening', port);
});