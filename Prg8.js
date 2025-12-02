const express = require('express');
const mongoose = require('mongoose');

const app = express();
// Middleware to parse JSON body
app.use(express.json());
// Connect to MongoDB
async function connectDB() {
 try {
  await mongoose.connect('mongodb://127.0.0.1:27017/dbserver');
  console.log("Connected to MongoDB");
 } catch (err) {
  console.error("MongoDB connection error:", err);
 }
}
connectDB();

// Define Mongoose model with flexible schema
const User = mongoose.model('User', new mongoose.Schema({}, { strict: false,versionKey: false }), 'users');

// ==================== ROUTES ====================

// POST /users — Create a new user
app.post('/users', async (req, res) => {
 try {
  const userData = req.body;
  const result = await User.create(userData);
  res.status(201).json({ message: "User created successfully", user: result });
 } catch (err) {
  console.error(err);
  res.status(500).json({ error: "Error creating user" });
 }
});

//GET /users — Fetch all users
app.get('/users', async (req, res) => {
 try {
  const users = await User.find();
  res.json(users);
 } catch (err) {
  console.error(err);
  res.status(500).json({ error: "Error fetching users" });
 }
});

// PUT /users/:id — Update a user by ID
app.put('/users/:id', async (req, res) => {
 try {
  const userId = req.params.id;
  const updateData = req.body;
  const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
  if (!updatedUser) {
   return res.status(404).json({ message: "User not found" });
  }
  res.json({ message: "User updated successfully", user: updatedUser });
 } catch (err) {
  console.error(err);
  res.status(500).json({ error: "Error updating user" });
 }
});

// DELETE /users/:id — Delete a user by ID
app.delete('/users/:id', async (req, res) => {
 try {
  const userId = req.params.id;
  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) {
   return res.status(404).json({ message: "User not found" });
  }
  res.json({ message: "User deleted successfully", user: deletedUser });
 } catch (err) {
  console.error(err);
  res.status(500).json({ error: "Error deleting user" });
 }
});

// Start server
app.listen(3000)
