const express = require('express');
const db = require('../db');
const router = express.Router();

// Get all shelters
router.get('/', (req, res) => {
  db.query('SELECT * FROM shelters', (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// Add new shelter
router.post('/', (req, res) => {
  const { name, location, phone,email } = req.body;
  const sql = 'INSERT INTO shelters (name, location, phone,email) VALUES (?, ?, ?,?)';
  db.query(sql, [name, location,phone,email], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ id: result.insertId, message: 'Shelter added successfully' });
  });
});

// Update shelter
router.put('/:id', (req, res) => {
  const { name, location, phone,email } = req.body;
  const sql = 'UPDATE shelters SET name=?, location=?, phone=?,email=? WHERE shelter_id=?';
  db.query(sql, [name, location, Phone,email, req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Shelter updated' });
  });
});

// Delete shelter
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM shelters WHERE shelter_id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Shelter deleted' });
  });
});

module.exports = router;
