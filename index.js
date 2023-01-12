const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const productsCollection = client.db('motoGarage').collection('products');
        const usersCollection = client.db('motoGarage').collection('users');
        const modalDataCollection = client.db('motoGarage').collection('modalData')
        
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
            const categoryProducts = await productsCollection.find(query).toArray()
            res.send(categoryProducts)
        })
        
        //... add products API ...//
        app.post('/products', async(req, res) => {
            const products = req.body;
            const result = await productsCollection.insertOne(products)
            res.send(result)
        })


        //... category products API ...//
        app.post('/users', async(req, res)=>{
            const users= req.body;
            const result = await usersCollection.insertOne(users)
            res.send(result)
        });
        
        //... modal data API ...//
        app.post('/modalData', async(req, res) => {
            const information = req.body;
            const result = await modalDataCollection.insertOne(information);
            res.send(result)
        })
        
        // --- api by myProducts for my review---//
        app.get('/myProducts', async(req, res) => {
            let query = {}
            const cursor = productsCollection.find(query);
            const myProductsAll = await cursor.toArray();
            res.send(myProductsAll);
        })

        // ... delete data from my products API ...//
        app.delete('/myProducts/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await productsCollection.deleteOne(query);
            res.send(result);
        })


        
        
        // testttttttttttttttttttttttttt//
        // app.get('/myProductsList', async(req, res) => {
        //     let query = {}
        //     if(req.query.email){
        //         query = {
        //             email: req.query.email
        //         }
        //     }
        //     const cursor = productsCollection.find(query);
        //     const userReviewByEmail = await cursor.toArray();
        //     res.send(userReviewByEmail);
        // })


// test 


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
