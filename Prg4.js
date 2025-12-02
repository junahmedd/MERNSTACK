const http = require('http');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname,"product.json");

function readProduct() {
    if(!fs.existsSync(DATA_FILE)){
        return [];
    }
    const data = fs.readFileSync(DATA_FILE,"utf-8");
    return JSON.parse(data || "[]");
}

function writeProduct(products) {
    fs.writeFileSync(DATA_FILE,JSON.stringify(products,null,2));
}

const server = http.createServer((req,res) => {
     const url = req.url;
     const method = req.method;
     res.setHeader('Content-Type', 'application/json; charset = utf-8');

     //GET products
     if (url === "/products" && method === "GET"){
        const products = readProduct();
        res.end(JSON.stringify(products));
     }
     else if (url === "/products" && method === "POST")
     {
        let body = "";
        req.on("data",chunk => {
            body +=chunk.toString();
        });
        req.on("end",() =>{
            try {
                const newProduct = JSON.parse(body);
            if(! newProduct.name || !newProduct.price){
                res.statusCode = 400;
                return res.end(JSON.stringify({error: "Name and Price are required"}));
            }
            const products = readProduct();
            products.push(newProduct);
            writeProduct(products);

            res.statusCode = 201;
            res.end(JSON.stringify({message:"Product added successfully"}));
        }
        catch (error) {
            res.statusCode = 400;
            res.end(JSON.stringify({error:"Invalid data"}));
        }
        });
     }
     else {
        res.statusCode = 404;
        res.end(JSON.stringify({error: "Route not found"}));
     }
    });

    server.listen (3000,hostname,() => {
        console.group(`Server rinnung on http://127.0.0.1:3000/products`);
    });

