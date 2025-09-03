const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Path to products.json
const dataFile = path.join(__dirname, "products.json");

// Helper functions
function readProducts() {
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify([]));
  }
  const data = fs.readFileSync(dataFile, "utf-8");
  return JSON.parse(data);
}

function writeProducts(products) {
  fs.writeFileSync(dataFile, JSON.stringify(products, null, 2));
}

// Routes
app.get("/api/products", (req, res) => {
  const products = readProducts();
  res.json(products);
});

app.post("/api/products", (req, res) => {
  const products = readProducts();
  const newProduct = { id: Date.now(), ...req.body };
  products.push(newProduct);
  writeProducts(products);
  res.json(newProduct);
});

app.put("/api/products/:id", (req, res) => {
  const products = readProducts();
  const index = products.findIndex(p => p.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: "Product not found" });
  products[index] = { ...products[index], ...req.body };
  writeProducts(products);
  res.json(products[index]);
});

app.delete("/api/products/:id", (req, res) => {
  let products = readProducts();
  products = products.filter(p => p.id != req.params.id);
  writeProducts(products);
  res.json({ success: true });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
