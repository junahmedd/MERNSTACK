const express = require("express");
const pool = require("./db"); // DB connection (pg Pool)
const app = express();
app.use(express.json());

// ================= CREATE USER =================
app.post("/users", (req, res) => {
  const { name, email } = req.body;

  pool.query(
    "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
    [name, email],
    (err, result) => {
      if (err) {
        console.error("Error creating user:", err);
        return res.status(500).json({ error: "Error creating user" });
      }
      res.status(201).json(result.rows[0]);
    }
  );
});

// ================= GET ALL USERS =================
app.get("/users", (req, res) => {
  pool.query("SELECT * FROM users", (err, result) => {
    if (err) {
      console.error(" Error fetching users:", err);
      return res.status(500).json({ error: "Error fetching users" });
    }
    res.json(result.rows);
  });
});

// ================= UPDATE USER =================
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  pool.query(
    "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
    [name, email, id],
    (err, result) => {
      if (err) {
        console.error(" Error updating user:", err);
        return res.status(500).json({ error: "Error updating user" });
      }
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(result.rows[0]);
    }
  );
});

// ================= DELETE USER =================
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [id], (err, result) => {
    if (err) {
      console.error("Error deleting user:", err);
      return res.status(500).json({ error: "Error deleting user" });
    }
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  });
});

// ================= START SERVER =================
app.listen(3002);
