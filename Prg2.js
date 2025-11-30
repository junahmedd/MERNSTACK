const http = require('http');
const port = 3000;

const server = http.createServer((req,res) =>{
    const url = req.url;
    res.setHeader('Content-Type','text/html');
    if (url === "/")
    {
        res.statusCode = 200;
        res.end('<h2>Hello World</h2><\n><p> Welcome to tech world </p>');
    }
    else if (url === "/about")
    {
        res.statusCode = 200;
        res.end('<h3>About page</h3><t><p>Ready to know about tech world</p>');
    }
    else {
        res.statusCode = 404;
        res.end("<h1> Error 404 </h1>")
    }
});

server.listen(3000,() => {
    console.log(`Server running on http://localhost:${port}`);
})
