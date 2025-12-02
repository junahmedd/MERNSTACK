const express = require('express');
const app = express();
const fs = require('fs');
const PORT = 3000;

// Global Custom Middleware - Logs method and URL to console and file
// This middleware will be executed for all the client request as it is Global
app.use((req, res, next) => {
  const logEntry = `[${req.method}] ${req.url}\n`;
  console.log(logEntry.trim());
  fs.appendFileSync('requests.log', logEntry);
  next();
});

// local middleware functions 
function middleware (req, res, next) {
console.log("good morning");
next();
} //end of function

function middleware2 (req, res, next) {
console.log("good evening!");
next();
}
app.get('/', middleware, middleware2, (req,res) => {
res.end ("Hello worId")  });


app.listen(3000,() => {
    console.log('Server running on http://localhost:3000')
});
