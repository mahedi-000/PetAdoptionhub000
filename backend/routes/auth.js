const express = require('express');
const router = express.Router();
const db = require('../db'); // Your DB connection
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 🔐 User Login Route
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ?";
db.query(sql, [email], async (err, result) => {
  if (err) return res.status(500).json({ error: "Database error" });
  if (result.length===0) return res.status(401).json({ error: "User not found" });
 const user=result[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ user_id: user.user_id, role: user.role }, "secretkey",{ expiresIn: "1h"});
  if (!token) return res.status(500).json({ error: "Token generation failed" });  
  res.json({ token, role: user.role, user_id: user.user_id });


  });
});

// 🆕 User Registration Route
router.post('/register', async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, 'user')";
    db.query(sql, [name, email, hashed, phone], (err, result) => {
      if (err) return res.status(500).json({ message: "User registration failed", error: err });
      return res.status(201).json({ message: "User registered" });
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

module.exports = router;

