const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

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

    console.log("MongoDB Connected");

    const db = client.db("book_heaven");

    const booksCollection = db.collection("books");

    const commentsCollection = db.collection("comments");

    app.get("/", (req, res) => {
      res.send("Book Heaven Server Running");
    });

    app.get("/books", async (req, res) => {
      const result = await booksCollection.find().toArray();
      res.send(result);
    });

    app.get("/books/:id", async (req, res) => {
      try {
        const result = await booksCollection.findOne({
          _id: new ObjectId(req.params.id),
        });

        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to get book" });
      }
    });

    app.get("/my-books", async (req, res) => {
      try {
        const result = await booksCollection
          .find({
            userEmail: req.query.email,
          })
          .toArray();

        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to get books" });
      }
    });

    app.post("/books", async (req, res) => {
      try {
        const data = req.body;

        let result;

        if (Array.isArray(data)) {
          result = await booksCollection.insertMany(data);
        } else {
          result = await booksCollection.insertOne(data);
        }

        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to add books" });
      }
    });

    app.put("/books/:id", async (req, res) => {
      try {
        const result = await booksCollection.updateOne(
          { _id: new ObjectId(req.params.id) },
          {
            $set: req.body,
          },
        );

        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to update book" });
      }
    });

    app.delete("/books/:id", async (req, res) => {
      try {
        const result = await booksCollection.deleteOne({
          _id: new ObjectId(req.params.id),
        });

        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to delete book" });
      }
    });

    app.post("/comments", async (req, res) => {
      try {
        const result = await commentsCollection.insertOne(req.body);

        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to add comment" });
      }
    });

    app.get("/comments/:bookId", async (req, res) => {
      try {
        const result = await commentsCollection
          .find({
            bookId: req.params.bookId,
          })
          .sort({ _id: -1 })
          .toArray();

        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to get comments" });
      }
    });
  } catch (error) {
    console.log(error);
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
