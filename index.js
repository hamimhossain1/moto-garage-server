const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


//... middleware ...//
app.use(cors());
app.use(express.json());



//... mongoDB connection ...//
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8l0k6oj.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


///////////////////////////////////////////////////////
//.................all API here ....................///
///////////////////////////////////////////////////////
async function run() {
    try {
        const category = client.db('motoGarage').collection('category');
        const products = client.db('motoGarage').collection('products');
        const usersCollection = client.db('motoGarage').collection('users');
        
        //... home page category API ...//
        app.get('/category', async(req, res) => {
            const query = {};
            const cursor = category.find(query);
            const categoryList = await cursor.toArray();
            res.send(categoryList);
        })
        
        //... category products API ...//
        app.get('/categoryProducts/:name', async(req, res) => {
            const name = req.params.name
            const query = {category : name};
            // const cursor = products.find(query);
            const categoryProducts = await products.find(query).toArray()
            res.send(categoryProducts)
        })
        
        //... category products API ...//
        app.post('/users', async(req, res)=>{
            const users= req.body;
            const result = await usersCollection.insertOne(users)
            res.send(result)
        });





    }
    finally{

    }
    
}
run().catch(err => console.error(err))



app.get('/', (req, res) => {
    res.send('Hello from Moto garage.')
})

app.listen(port, () => {
    console.log(`This app is listening on port ${port}...!`)
})
