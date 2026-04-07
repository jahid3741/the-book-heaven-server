const express = require("express");

const app = express();
const port = process.env.PORT || 3000;
const jwt = require("jsonwebtoken"); // FIX
// test route
app.get("/", (req, res) => {
  res.send("🚀 The Book Heaven Server is running!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// jwt token generation route
app.post("/jwt", (req, res) => {
  const user = req.body; // { email }

  const token = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.send({ token });
});