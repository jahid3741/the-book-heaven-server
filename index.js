const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// mongodb connection
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const db = client.db("book_heaven");
    const booksCollection = db.collection("books");

    console.log("MongoDB connected");

    // get all books
    app.get("/books", async (req, res) => {
      const result = await booksCollection.find().toArray();
      res.send(result);
    });

    // add book (single or multiple)
    app.post("/books", async (req, res) => {
      const data = req.body;

      let result;

      if (Array.isArray(data)) {
        result = await booksCollection.insertMany(data);
      } else {
        result = await booksCollection.insertOne(data);
      }

      res.send(result);
    });

    // get single book by id
    app.get("/books/:id", async (req, res) => {
      const id = req.params.id;

      const result = await booksCollection.findOne({
        _id: new ObjectId(id),
      });

      res.send(result);
    });

    // update book by id
    app.patch("/books/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;

      const result = await booksCollection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: updatedData,
        },
      );

      res.send(result);
    });

    // delete book by id
    app.delete("/books/:id", async (req, res) => {
      const id = req.params.id;

      const result = await booksCollection.deleteOne({
        _id: new ObjectId(id),
      });

      res.send(result);
    });


  } catch (error) {
    console.log(error);
  }
}

run().catch(console.dir);

// root route
app.get("/", (req, res) => {
  res.send("The Book Heaven Server is running");
});

// server start
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
