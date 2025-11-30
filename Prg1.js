const http = require('http');
const port = 3000;
const server = http.createServer((req,res) => {
    let url = req.url;
    res.setHeader('Content-Type','text/plain');
    if(url === "/"){
        res.statusCode = 200;
        res.end("Hello World!"); 
    }
    else if(url === "/about")
    {
        res.statusCode = 200;
        res.end("About Page");
    }
    else {
        res.statusCode = 404;
        res.end("Error 404");
    }
});

server.listen(3000,() => {
        console.log(`Server running on http://localhost:3000/`);
    });
