const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://cabtrack:BlueDiamond2024@cabtrack.346mg.mongodb.net/?retryWrites=true&w=majority&appName=cabtrack";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const dbName = 'cabtrack';
const collectionName = 'users';
const database = client.db(dbName);
const collection = database.collection(collectionName);

exports.connectToDB = async () => {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("users").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
};

exports.connectToDB().catch(console.dir);

exports.addQuery = async (inputJson) => {
  await client.connect();
  try {
    const insertResult = await collection.insertOne(JSON.parse(inputJson));
    await client.close();
    return {"status":"success"};
  }
  catch(err){
    console.log('Database insert operation failed'+err);
    return {err};
  }
}


exports.getQuery = async (inputJson) => {
  await client.connect();
  try {
    console.log("raw input received in the DB:"+inputJson);
    console.log("input after toString:"+inputJson.toString());
    const findResult = await collection.findOne(inputJson);
    await client.close();
    console.log("result: "+JSON.stringify(findResult));
    //return JSON.stringify(findResult);
    return (findResult);
  }
  catch(err){
    console.log('Database read operation failed'+err);
    return err;
  }
}
