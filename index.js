const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
var app = express();

app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

var items = [];
var itemIdCounter = 1;

app.get("/", function(req,res){
    const filter = req.query.filter || 'all';
    let filteredItems = items;
    
    if (filter === 'high') {
        filteredItems = items.filter(item => item.priority === 'high');
    } else if (filter === 'medium') {
        filteredItems = items.filter(item => item.priority === 'medium');
    } else if (filter === 'low') {
        filteredItems = items.filter(item => item.priority === 'low');
    }
    
    res.render("list", {
        ejes: filteredItems,
        currentFilter: filter,
        allItems: items
    });
});

app.post("/", function(req,res){
    const taskText = req.body.ele1;
    const priority = req.body.priority || 'medium';
    
    if (taskText && taskText.trim() !== '') {
        const item = {
            id: itemIdCounter++,
            text: taskText.trim(),
            priority: priority
        };
        items.push(item);
    }
    
    res.redirect("/");
});

app.post("/edit/:id", function(req,res){
    const itemId = parseInt(req.params.id);
    const newText = req.body.editText;
    const newPriority = req.body.editPriority;
    
    const itemIndex = items.findIndex(item => item.id === itemId);
    if (itemIndex !== -1 && newText && newText.trim() !== '') {
        items[itemIndex].text = newText.trim();
        items[itemIndex].priority = newPriority;
    }
    
    res.redirect("/");
});

app.post("/delete/:id", function(req,res){
    const itemId = parseInt(req.params.id);
    items = items.filter(item => item.id !== itemId);
    res.redirect("/");
});

app.listen(4000, function(){
    console.log("Server started on port 4000");
});