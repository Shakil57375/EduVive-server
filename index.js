const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// EduVive
// FbZCoc5gg21BvHtZ

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lc40fqb.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const usersCollection = client.db("EduViveDb").collection("user");
    const collageCollection = client.db("EduViveDb").collection("collages");
    const StudentCollection = client.db("EduViveDb").collection("info");

    const indexKeys = { collegeName: 1 };
    const indexOptions = { name: "title" };

    const result = await collageCollection.createIndex(indexKeys, indexOptions);

    app.get("/CollageSearchByName/:name", async (req, res) => {
      const SearchName = req.params.name;
      const result = await collageCollection
        .find({
          $or: [
            {
              collegeName: { $regex: SearchName, $options: "i" },
            },
            {
              admissionDate: { $regex: SearchName, $options: "i" },
            },
          ],
        })
        .toArray();
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const body = req.body;
      const result = await usersCollection.insertOne(body);
      res.send(result);
    });

    app.post("/studentInfo", async (req, res) => {
      const body = req.body;
      const result = await StudentCollection.insertOne(body);
      res.send(result);
    });

    app.get("/research", async (req, res) => {
      const result = await collageCollection.find().toArray();
      res.send(result);
    });

    // get colleges details
    app.get("/collegesDetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await collageCollection.findOne(query);
      res.send(result);
      console.log(result);
    });

    

    // get popular colleges details
    app.get("/popularcolleges/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await collageCollection.findOne(query);
      res.send(result); 
      console.log(result);
    });

    app.get("/popularCollage", async (req, res) => {
      const result = await collageCollection.find().toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("admission is running");
});

app.listen(port, () => {
  console.log(`EduVive is running on port ${port}`);
});
