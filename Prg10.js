const express = require('express');
const pool = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());
const secret_code = 'mysecret@555';
// ========================= SIGNUP =========================
app.post('/signup', async (req, res) => {
const { name, password } = req.body;
const hashedPassword = await bcrypt.hash(password, 10);
try {
const result = await pool.query('INSERT INTO users (name, password) VALUES ($1, $2) RETURNING *',[name, hashedPassword]);
res.status(201).json(result.rows[0]);
} catch (err) {
console.error(err);
res.status(500).send('error in creating users');
}
});
// ========================= LOGIN =========================
app.post('/login', async (req, res) => {
const { name, password } = req.body;
try {
const result = await pool.query('SELECT * FROM users WHERE name=$1',[name]);
const user = result.rows[0];
// Wrong username
if (!user || !(await bcrypt.compare(password,user.password)))
return res.status(401).send('unauthorized credentials');
const token=jwt.sign({name},secret_code,{expiresIn:'1hr'});
res.json({token});
} catch (err) {
console.error(err);
res.status(500).send('error in fetching users');
}
});
// ========================= PROFILE ROUTE =========================
app.get('/profile', authorize, (req, res) => {
res.json({ message: `welcome ${req.user.name}` });
});
// ========================= AUTH MIDDLEWARE =========================
function authorize(req, res, next) {
const auth_header = req.headers['authorization'];
const token = auth_header && auth_header.split(' ')[1];
console.log(token);
if (!token) {
return res.status(401).send('authorization failed (provide token)');
}
jwt.verify(token, secret_code, (err, user) => {
if (err) {
return res.status(403).send('provided token is invalid');
}
req.user = user;
next();
});
}
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
