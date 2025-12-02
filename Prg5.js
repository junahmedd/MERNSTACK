const express = require('express');
const app = express();
app.use(express.json());

let items = [];
let id = 1;

app.get("/items",(req,res) =>{
    res.json(items);
});

app.post("/items",(req,res)=>{
    const {name,price} = req.body;

    if(!name || !price){
        return res.status(400).json({error:"Name and Price is reuired.. "});
    }
    const newItem = {
        id: id++,
        name,
        price
    }
    items.push(newItem);
    res.json({message: "Items added successfully.."});
});

app.put("/items/:id",(req,res) => {
    const {id} = req.params;
    const {name, price} = req.body;
    const item = items.find(i => i.id === parseInt(id));
    if(!item) {
        return res.status(404).json({error: "Item not found"});
    }
    if(!name || !price){
        return res.status(400).json({error:"Name and Price is required"});
    }
    item.name = name;
    item.price = price;
    return res.status(201).json({message:"Items added successfully"});
});

app.delete("/items/:id",(req,res) =>{
    const {id} = req.params;
    let index = items.findIndex(i => i.id === parseInt(id));
    if(index == -1){
        return res.json({error: "Item not found"});
    }
    items.splice(index,1);
    res.status(200).json({message:"Items successfully deleted"});
});

app.listen(3000,() =>{
    console.log(`Server running at http://localhost:3000/items`)
});
