const express = require("express");
const router = express.Router();
const db = require("../db");
const {auth ,isAdmin} = require("../middleware/authMiddleware");

// 🆕 Book an appointment
router.post("/book", auth, (req, res) => {
  const { pet_id,date,time, reason } = req.body;
  const user_id = req.user.user_id;

  const sql = `
    INSERT INTO appointments (user_id, pet_id,date,time, reason, status)
    VALUES (?, ?, ?, ?,?, 'pending')`;

  db.query(sql, [user_id, pet_id,date,time, reason], (err, result) => {
    if (err) return res.status(500).json({ error: "Booking failed", err });
    res.json({ message: "Appointment booked", appointment_id: result.insertId });
  });
});

// 👤 Get all appointments for the logged-in user
router.get("/user", auth, (req, res) => {
  const user_id = req.user.user_id;

  const sql = `
    SELECT a.*, p.name AS pet_name 
    FROM appointments a 
    JOIN pets p ON a.pet_id = p.pet_id 
    WHERE a.user_id = ? ORDER BY date,time DESC`;

  db.query(sql, [user_id], (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch appointments" });
    res.json(results);
  });
});

// ❌ Cancel an appointment
router.put("/cancel/:id", auth, (req, res) => {
  const sql = `UPDATE appointments SET status = 'cancelled' WHERE appointment_id = ?`;

  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: "Cancel failed" });
    res.json({ message: "Appointment cancelled" });
  });
});
// Update appointment status
router.put("/status/:id", auth, isAdmin, (req, res) => {
  const { status } = req.body;
  const sql = "UPDATE appointments SET status = ? WHERE appointment_id = ?";
  db.query(sql, [status, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: "Update failed" });
    res.json({ message: "Appointment status updated" });
  });
});

module.exports = router;
