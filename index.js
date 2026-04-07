const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { MongoClient, ServerApiVersion } = require("mongodb"); 

const app = express();
const port = process.env.PORT || 3000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB setup
const uri = process.env.MONGO_URI; 

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Connect MongoDB
async function run() {
  try {
    await client.connect(); // FIX: connect DB
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.log(error);
  }
}

run().catch(console.dir);

//  Root route
app.get("/", (req, res) => {
  res.send("📚 The Book Heaven Server is running!");
});

//  Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});