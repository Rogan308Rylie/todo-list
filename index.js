const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
var app = express();

app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method')); // Enable method override

var items = [];
var ex = "working";

app.get("/", function(req,res){
    res.render("list", {ejes : items});
});

app.post("/", function(req,res){
    var item = req.body.ele1;
    items.push(item);
    res.redirect("/");
});

app.delete("/clear", function(req,res){
    items = []; // Clear all tasks using DELETE method
    res.redirect("/");
});

app.listen(4000, function(){
    console.log("Server started");
});