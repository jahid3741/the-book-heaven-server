const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { MongoClient, ServerApiVersion } = require("mongodb");

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

    // database & collection
    const db = client.db("book_heaven");
    const booksCollection = db.collection("books");

    console.log("MongoDB connected");
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