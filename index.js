const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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
      res.json(result);
    });

    // get single book
    app.get("/books/:id", async (req, res) => {
      const id = req.params.id;

      const result = await booksCollection.findOne({ _id: id });

      if (!result) {
        return res.status(404).json({ message: "Book not found" });
      }

      res.json(result);
    });

    // get books by user
    app.get("/my-books", async (req, res) => {
      const email = req.query.email;
      const result = await booksCollection.find({ userEmail: email }).toArray();
      res.json(result);
    });

    // latest books
    app.get("/latest-books", async (req, res) => {
      const result = await booksCollection
        .find()
        .sort({ _id: -1 })
        .limit(6)
        .toArray();
      res.json(result);
    });

    // add book
    app.post("/books", async (req, res) => {
      const result = await booksCollection.insertOne(req.body);
      res.json(result);
    });

    // update book
    app.put("/books/:id", async (req, res) => {
      const id = req.params.id;

      const result = await booksCollection.updateOne(
        { _id: id },
        { $set: req.body },
      );

      res.json(result);
    });

    // delete book
    app.delete("/books/:id", async (req, res) => {
      const id = req.params.id;

      const result = await booksCollection.deleteOne({ _id: id });
      res.json(result);
    });
  } catch (error) {
    console.log(error);
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("The Book Heaven Server is running");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
