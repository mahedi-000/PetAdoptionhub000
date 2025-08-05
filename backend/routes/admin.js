const express = require("express");
const router = express.Router();
const db = require("../db");
const {auth,isAdmin} = require("../middleware/authMiddleware");

// GET /admin/users/full
router.get('/users/full', (req, res) => {
  
  const sql = `
    SELECT * FROM users where role != 'admin';
  `;
  db.query(sql, async (err, users) => {
    if (err) return res.status(500).json({ error: "User fetch error" });

    const fullData = await Promise.all(users.map(async (user) => {
      const [adoptions] = await db.promise().query("SELECT * FROM adoptions WHERE user_id = ?", [user.user_id]);
      const [appointments] = await db.promise().query("SELECT * FROM appointments WHERE user_id = ?", [user.user_id]);
      const [reviews] = await db.promise().query("SELECT * FROM reviews WHERE user_id = ?", [user.user_id]);

      return { ...user, adoptions, appointments, reviews };
    }));

    res.json(fullData);
  });
});


// ✅ Admin: Get all users and their details
router.get("/users", auth, isAdmin,(req, res) => {

  const sql = "SELECT user_id, name, email, phone, role FROM users";
  db.query(sql, (err, users) => {
    if (err) return res.status(500).json({ error: "Failed to fetch users" });
    res.json(users);
  });
});

// ✅ Admin: Get a specific user's adoptions
router.get("/users/:id/adoptions", auth,isAdmin ,(req, res) => {

  const sql = `
    SELECT a.*, p.name AS pet_name 
    FROM adoptions a 
    JOIN pets p ON a.pet_id = p.pet_id 
    WHERE a.user_id = ?`;
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch adoptions" });
    res.json(results);
  });

});

// ✅ Admin: Get a specific user's appointments
router.get("/users/:id/appointments", auth, isAdmin,(req, res) => {


  const sql = `
    SELECT ap.*, p.name AS pet_name 
    FROM appointments ap 
    JOIN pets p ON ap.pet_id = p.pet_id 
    WHERE ap.user_id = ?`;
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch appointments" });
    res.json(results);
  });
});

// ✅ Admin: Get a specific user's reviews
router.get("/users/:id/reviews", auth, isAdmin,(req, res) => {
  

  const sql = `
    SELECT r.*, p.name AS pet_name 
    FROM reviews r 
    JOIN pets p ON r.pet_id = p.pet_id 
    WHERE r.user_id = ?`;
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch reviews" });
    res.json(results);
  });
});
router.put('/admin/adoption-status/:id', auth, isAdmin, (req, res) => {
  const { status } = req.body;
  const sql = `UPDATE adoptions SET status = ? WHERE adoption_id = ?`;
  db.query(sql, [status, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: "Update failed" });
    res.json({ message: "Status updated" });
  });
});
// ✅ Admin: Get a specific user's details with adoptions, appointments, and reviews
router.get("/users/:id",auth, (req, res) => {
  const user_id = req.params.id;

  const getUserSql = "SELECT user_id, name, email, role FROM users WHERE user_id = ?";
  const getAdoptionsSql = `
    SELECT a.*, p.name AS pet_name
    FROM adoptions a
    JOIN pets p ON a.pet_id = p.pet_id
    WHERE a.user_id = ?
    ORDER BY a.start_date DESC
  `;
  const getAppointmentsSql = `
    SELECT ap.*, p.name AS pet_name
    FROM appointments ap
    JOIN pets p ON ap.pet_id = p.pet_id
    WHERE ap.user_id = ?
    ORDER BY ap.appointment_date DESC
  `;
  const getReviewsSql = `
    SELECT r.*, p.name AS pet_name
    FROM reviews r
    JOIN pets p ON r.pet_id = p.pet_id
    WHERE r.user_id = ?
    ORDER BY r.created_at DESC
  `;

  db.query(getUserSql, [user_id], (err, userResults) => {
    if (err) return res.status(500).json({ error: "User fetch failed" });
    if (userResults.length === 0) return res.status(404).json({ error: "User not found" });

    const user = userResults[0];

    db.query(getAdoptionsSql, [user_id], (err, adoptionResults) => {
      if (err) return res.status(500).json({ error: "Adoption fetch failed" });

      db.query(getAppointmentsSql, [user_id], (err, appointmentResults) => {
        if (err) return res.status(500).json({ error: "Appointments fetch failed" });

        db.query(getReviewsSql, [user_id], (err, reviewResults) => {
          if (err) return res.status(500).json({ error: "Reviews fetch failed" });

          res.json({
            ...user,
            adoptions: adoptionResults,
            appointments: appointmentResults,
            reviews: reviewResults,
          });
        });
      });
    });
  });
});

module.exports = router;
