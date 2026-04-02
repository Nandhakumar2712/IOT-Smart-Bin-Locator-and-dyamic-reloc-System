require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Allows parsing JSON bodies

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected securely!'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// 1. Define the Pin Schema
const PinSchema = new mongoose.Schema({
  id: String, // Kept as string to easily sync with Leaflet map markers
  name: String,
  last: String,
  next: String,
  status: String,
  contact: String,
  notes: String,
  lat: Number,
  lng: Number,
  color: String
});

const Pin = mongoose.model('Pin', PinSchema);

// ==========================================
// AUTHENTICATION ROUTES (Mocked for Demo)
// ==========================================

// User Login Route
app.post('/api/auth/user', (req, res) => {
  // In a real app, you would check bcrypt hashed passwords here
  const token = jwt.sign({ role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token: token, message: 'User logged in successfully' });
});

// Admin Login Route
app.post('/api/auth/admin', (req, res) => {
  // Mock validation for the admin
  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token: token, message: 'Admin authenticated successfully' });
});

// ==========================================
// PIN MANAGEMENT ROUTES
// ==========================================

// Get all Pins
app.get('/api/pins', async (req, res) => {
  try {
    const pins = await Pin.find();
    res.json({ pins: pins });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching pins' });
  }
});

// Save a new Pin
app.post('/api/pins', async (req, res) => {
  try {
    const newPin = new Pin(req.body);
    const savedPin = await newPin.save();
    res.status(201).json(savedPin);
  } catch (error) {
    res.status(500).json({ message: 'Server error saving pin' });
  }
});

// Delete a Pin
app.delete('/api/pins/:id', async (req, res) => {
  try {
    // Delete based on the custom string ID passed from frontend
    await Pin.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Pin successfully removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting pin' });
  }
});

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 SmartBin API running on port ${PORT}`));