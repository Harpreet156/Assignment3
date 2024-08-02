require("dotenv").config();
const PORT = process.env.PORT || 3000;
const express = require("express");
const app = express();
const path = require("path");
const upload_router = require("./router/upload_router");
const fetch_router = require("./router/fetch_router")

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use("/upload", upload_router);
app.use("/fetch", fetch_router);

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/index.html"));
});

app.get("/gallery", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "gallery.html"));
});

// Serve gallery-pagination.html
app.get("/gallery-pagination", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "gallery-pagination.html"));
});

app.get("/fetch", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/fetch-random.html"));
});
app.get("/fetch-multiple-random", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/fetch-multiple-random.html"));
});

// Handle 404
app.use((req, res) => {
  res.status(404).send("Route does not exist on our server");
});

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);
  let db = mongoose.connection;
  db.once("open", () => {
    console.log("Connected to MongoDB");
  });
  db.on("error", (err) => {
    console.error("DB Error:" + err);
  });

// Start the server
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
