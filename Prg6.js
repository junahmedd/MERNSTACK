const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
// File to store products data
const DATA_FILE = path.join(__dirname, "products.json");
// Middleware
app.use(express.json()); // Automatically parse JSON request body

// ------------------- Utility Functions -------------------

// Read data from file (counter + items)
function readData() {
  if (!fs.existsSync(DATA_FILE)) {
    // If file does not exist, start fresh  
    return { counter: 0, items: [] };
  }
  const data = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(data || '{"counter":0,"items":[]}');
}

// Write data to file
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ------------------- ROUTES -------------------

// GET all products
app.get("/products", (req, res) => {
  const data = readData();
  res.json(data.items);
});

app.get("/products/:id", (req, res) => {
  const { id } = req.params;
  const data = readData();
  const productIndex = data.items.findIndex((p) => p.id == parseInt(id));
  res.json(data.items[productIndex]);
});

// POST a new product
app.post("/products", (req, res) => {
  const { name, price } = req.body;
  // Validate input
  if (!name || !price) {
    return res.status(400).json({ error: "Name and price are required" });
  }
  const data = readData();
  // Increment counter for unique ID
  const newProduct = { id: ++data.counter, name, price };
  data.items.push(newProduct);
  writeData(data);
  res.status(201).json({ message: " Product added successfully", product: newProduct });
});

// PUT (Update) an existing product by ID
app.put("/products/:id", (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  const data = readData();
  const productIndex = data.items.findIndex(p => p.id === parseInt(id));
  if (productIndex === -1) {
    return res.status(404).json({ error: " Product not found" });
  }
  // Validate fields
  if (!name || !price) {
    return res.status(400).json({ error: "Name and price are required" });
  }
  // Update product  ...data.items[productIndex]
  data.items[productIndex] = { ...data.items[productIndex], name, price };
  writeData(data);
  res.json({ message: "Product updated successfully", product: data.items[productIndex] });
});

// DELETE a product by ID
app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  const data = readData();
  const filteredItems = data.items.filter((p) => p.id !== parseInt(id));
  if (data.items.length === filteredItems.length) {
    return res.status(404).json({ error: " Product not found" });
  }
  data.items = filteredItems;
  writeData(data);
  res.json({ message: ` Product with id ${id} deleted successfully` });
});

// Handle invalid routes
app.use((req, res) => {
  res.status(404).json({ error: " Route not found" });
});

// Start the server
app.listen(3002)
