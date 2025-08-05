const express = require("express");
const router = express.Router();
const db = require("../db");
const {auth ,isadmin} = require("../middleware/authMiddleware");

// 📝 Add a review
router.post("/add", auth, (req, res) => {
  const { pet_id, rating, comment } = req.body;
  const user_id = req.user.user_id;

  const sql = `
    INSERT INTO reviews (user_id, pet_id, rating, comment)
    VALUES (?, ?, ?, ?)`;

  db.query(sql, [user_id, pet_id, rating, comment], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to add review", err });
    res.json({ message: "Review submitted", review_id: result.insertId });
  });
});

// 👁 Get all reviews by the logged-in user
router.get("/user", auth, (req, res) => {
  const user_id = req.user.user_id;

  const sql = `
    SELECT r.*, p.name AS pet_name
    FROM reviews r
    JOIN pets p ON r.pet_id = p.pet_id
    WHERE r.user_id = ? ORDER BY r.review_id DESC`;

  db.query(sql, [user_id], (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch reviews" });
    res.json(results);
  });
});

module.exports = router;
