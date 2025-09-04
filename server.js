const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Path to products file
const productsFile = path.join(__dirname, "products.json");

// Helper to read products
function readProducts() {
  try {
    const data = fs.readFileSync(productsFile, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return []; // return empty list if file is missing or invalid
  }
}

// Helper to save products
function saveProducts(products) {
  fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
}

// --- API Routes ---

// Get all products
app.get("/api/products", (req, res) => {
  const products = readProducts();
  res.json(products);
});

// Add a product
app.post("/api/products", (req, res) => {
  const products = readProducts();
  const newProduct = {
    id: Date.now(),
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    image: req.body.image || ""
  };
  products.push(newProduct);
  saveProducts(products);
  res.status(201).json(newProduct);
});

// Delete a product
app.delete("/api/products/:id", (req, res) => {
  const products = readProducts();
  const filtered = products.filter(p => p.id != req.params.id);
  saveProducts(filtered);
  res.json({ success: true });
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
