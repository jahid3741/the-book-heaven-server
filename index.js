const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error("MONGO_URI is missing");
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const db = client.db("book_heaven");

const booksCollection = db.collection("books");
const commentsCollection = db.collection("comments");

async function connectMongo() {
  try {
    await client.connect();
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(error);
  }
}

connectMongo();

app.get("/", (req, res) => {
  res.send("Book Heaven Server Running");
});

app.get("/books", async (req, res) => {
  try {
    const result = await booksCollection.find().toArray();
    res.send(result);
  } catch (error) {
    console.error(error);

    res.status(500).send({
      message: "Failed to fetch books",
      error: error.message,
    });
  }
});

app.get("/books/:id", async (req, res) => {
  try {
    const result = await booksCollection.findOne({
      _id: new ObjectId(req.params.id),
    });

    res.send(result);
  } catch (error) {
    console.error(error);

    res.status(500).send({
      message: "Failed to fetch book",
      error: error.message,
    });
  }
});

module.exports = app;
