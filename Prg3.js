const http = require('http');
const path = require('path');
const fs = require('fs');
const hostname = '127.0.0.1';
const port = 5000;
const mimeTypes = {
    ".html" : "text/html",
    ".js" : "application/javascript",
    ".css" : "text/css",
}
const server = http.createServer((req,res) => {
    let filePath = path.join(__dirname,req.url === "/"? "index.html" : req.url); // Ternary Operation
    let ext = path.extname(filePath);
    let contentType = mimeTypes[ext] || 'text/plain';
    fs.readFile(filePath,(err,content) => {
        if(err){
            res.writeHead(404,{'Content-Type':'text/plain'});
            res.end("Page not found");
        }
        else {
            res.writeHead(200,{"Content-Type":contentType});
            res.end(content);
        }
    });
});

server.listen(5000,() => {
    console.log(`Server running on http://${hostname}:${port}/`);
    });
