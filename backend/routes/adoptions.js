const express = require("express");
const router = express.Router();
const db = require("../db");
const {auth ,isadmin} = require("../middleware/authMiddleware");

// 🆕 Request an adoption
router.post("/request", auth, (req, res) => {
  const { pet_id, price, durationDays } = req.body;
  const user_id = req.user.user_id;

  const startDate = new Date();
  const endDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);

  const sql = `INSERT INTO adoptions (user_id, pet_id, price, start_date, end_date, status)
               VALUES (?, ?, ?, ?, ?, 'pending')`;

  db.query(sql, [user_id, pet_id, price, startDate, endDate], (err, result) => {
    if (err) return res.status(500).json({ error: "Adoption request failed", err });
    res.json({ message: "Adoption requested", adoption_id: result.insertId });
  });
});

// 🔁 Renew an adoption
router.put("/renew/:id", auth, (req, res) => {
  const adoption_id = req.params.id;
  const sql = `UPDATE adoptions 
               SET end_date = DATE_ADD(end_date, INTERVAL 30 DAY) 
               WHERE adoption_id = ? AND status != 'cancelled'`;

  db.query(sql, [adoption_id], (err, result) => {
    if (err) return res.status(500).json({ error: "Renewal failed" });
    res.json({ message: "Adoption renewed" });
  });
});

// ❌ Cancel an adoption
router.put("/cancel/:id", auth, (req, res) => {
  const adoption_id = req.params.id;
  const sql = `UPDATE adoptions SET status = 'cancelled' WHERE adoption_id = ?`;

  db.query(sql, [adoption_id], (err, result) => {
    if (err) return res.status(500).json({ error: "Cancellation failed" });
    res.json({ message: "Adoption cancelled" });
  });
});

// 👤 Get all adoptions for the logged-in user
router.get("/user", auth, (req, res) => {
  const user_id = req.user.user_id;
  const sql = `SELECT * FROM adoptions WHERE user_id = ? ORDER BY start_date DESC`;

  db.query(sql, [user_id], (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch adoptions" });
    res.json(results);
  });
});
module.exports = router;




/*const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken,isAdmin } = require('../middleware/authMiddleware');

// 📤 Request an adoption
router.post('/request', authenticateToken, (req, res) => {
  const { pet_id, price, durationDays } = req.body;
  const user_id = req.user.user_id;
  const startDate = new Date();
  const endDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);

  const sql = `INSERT INTO adoptions (user_id, pet_id, price, start_date, end_date, status) 
               VALUES (?, ?, ?, ?, ?, 'pending')`;

  db.query(sql, [user_id, pet_id, price, startDate, endDate], (err) => {
    if (err) return res.status(500).json({ error: "Failed to request adoption", err });
    res.json({ message: "Adoption request submitted" });
  });
});
router.get('/my-adoptions', authenticateToken, (req, res) => {
  const sql = `SELECT a.*, p.name AS pet_name
               FROM adoptions a 
               JOIN pets p ON a.pet_id = p.pet_id
               WHERE a.user_id = ?`;
  db.query(sql, [req.user.user_id], (err, results) => {
    if (err) return res.status(500).json({ error: "Error fetching adoptions" });
    res.json(results);
  });
});
// ⏳ Renew
router.put('/renew/:id', authenticateToken, (req, res) => {
  const { extraDays } = req.body;
  const sql = `UPDATE adoptions 
               SET end_date = DATE_ADD(end_date, INTERVAL ? DAY) 
               WHERE adoption_id = ? AND user_id = ?`;
  db.query(sql, [extraDays, req.params.id, req.user.user_id], (err) => {
    if (err) return res.status(500).json({ error: "Renewal failed" });
    res.json({ message: "Renewed" });
  });
});

// ❌ Cancel
router.delete('/cancel/:id', authenticateToken, (req, res) => {
  const sql = `UPDATE adoptions SET status = 'cancelled' 
               WHERE adoption_id = ? AND user_id = ?`;
  db.query(sql, [req.params.id, req.user.user_id], (err) => {
    if (err) return res.status(500).json({ error: "Cancellation failed" });
    res.json({ message: "Cancelled" });
  });
});
// 🏢manage
router.get('/admin/users-adoptions', authenticateToken, isAdmin, (req, res) => {
  const sql = `
    SELECT u.user_id, u.name, u.email, u.phone, 
           a.adoption_id, a.pet_id, a.price, a.status, a.start_date, a.end_date, 
           p.name AS pet_name
    FROM users u
    LEFT JOIN adoptions a ON u.user_id = a.user_id
    LEFT JOIN pets p ON a.pet_id = p.pet_id
  `;
  db.query(sql, [], (err, results) => {
    if (err) return res.status(500).json({ error: "DB error" });

    const map = {};
    results.forEach(row => {
      if (!map[row.user_id]) {
        map[row.user_id] = {
          user_id: row.user_id,
          name: row.name,
          email: row.email,
          phone: row.phone,
          adoptions: []
        };
      }
      if (row.adoption_id) {
        map[row.user_id].adoptions.push({
          adoption_id: row.adoption_id,
          pet_name: row.pet_name,
          price: row.price,
          status: row.status,
          start_date: row.start_date,
          end_date: row.end_date
        });
      }
    });

    res.json(Object.values(map));
  });
});
// 📝 Update adoption status
router.put('/admin/adoption-status/:id', authenticateToken, isAdmin, (req, res) => {
  const { status } = req.body;
  const sql = `UPDATE adoptions SET status = ? WHERE adoption_id = ?`;
  db.query(sql, [status, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: "Update failed" });
    res.json({ message: "Status updated" });
  });
});
module.exports = router;*/