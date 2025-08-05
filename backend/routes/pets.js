const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res) => {
  db.query('SELECT * FROM pets', (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});
router.post('/', (req, res) => {
  const { name, type, breed, age, gender, price, status, shelter_id } = req.body;
  const sql = `INSERT INTO pets (name, type, breed, age, gender, price, status, shelter_id)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [name, type, breed, age, gender, price, status, shelter_id], (err, result) => {
    if (err) {
      console.error("Pet Insert Error:", err);
      return res.status(500).json({ error: "Database insert failed", details: err.message });
    }
    res.json({ message: 'Pet added successfully', id: result.insertId });
  });
});

router.put('/:id', (req, res) => {
  const { name, type, breed, age, gender,price, status, shelter_id } = req.body;
  const sql = 'UPDATE pets SET name=?, type=?, breed=?, age=?, gender=?,price=?, status=?, shelter_id=? WHERE pet_id=?';
  db.query(sql, [name, type, breed, age, gender,price, status, shelter_id, req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Pet updated' });
  });
});

router.delete('/:id', (req, res) => {
  db.query('DELETE FROM pets WHERE pet_id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Pet deleted' });
  });
});
router.get('/:id', (req, res) => {
  const sql = 'SELECT price FROM pets WHERE pet_id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to fetch price" });
    res.json(result); // should be an array with one item
  });
});

router.post('/search', (req, res) => {
  const { name, category, minAge, maxAge, gender, available, location } = req.body;

  let sql = `SELECT p.*, s.location 
             FROM pets p 
             JOIN shelters s ON p.shelter_id = s.shelter_id 
             WHERE 1=1`;
  let params = [];

  if (name) {
    sql += ` AND p.name LIKE ?`;
    params.push(`%${name}%`);
  }
  if (category) {
    sql += ` AND p.type = ?`;
    params.push(category);
  }
  if (minAge) {
    sql += ` AND p.age >= ?`;
    params.push(minAge);
  }
  if (maxAge) {
    sql += ` AND p.age <= ?`;
    params.push(maxAge);
  }
  if (gender) {
    sql += ` AND p.gender = ?`;
    params.push(gender);
  }
  if (available) {
    sql += ` AND p.status = 'Available'`;
  }
  if (location) {
    sql += ` AND s.location LIKE ?`;
    params.push(`%${location}%`);
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: 'Search failed', err });
    res.json(results);
  });
});

module.exports = router;
