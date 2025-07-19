require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
var app = express();

app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

const mongoURI = process.env.MONGODB_URI || 'YOUR_CONNECTION_STRING';

mongoose.connect(mongoURI)
.then(() => {
    console.log('Connected to MongoDB Atlas successfully!');
})
.catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
});

const todoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Todo = mongoose.model('Todo', todoSchema);

app.get("/", async function(req, res) {
    try {
        const filter = req.query.filter || 'all';
        let query = {};
        
        if (filter === 'high') {
            query.priority = 'high';
        } else if (filter === 'medium') {
            query.priority = 'medium';
        } else if (filter === 'low') {
            query.priority = 'low';
        }
        
        const filteredItems = await Todo.find(query).sort({ createdAt: -1 });
        const allItems = await Todo.find({}).sort({ createdAt: -1 });
        
        res.render("list", {
            ejes: filteredItems,
            currentFilter: filter,
            allItems: allItems
        });
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).send('Error fetching todos');
    }
});

app.post("/", async function(req, res) {
    try {
        const taskText = req.body.ele1;
        const priority = req.body.priority || 'medium';
        
        if (taskText && taskText.trim() !== '') {
            const newTodo = new Todo({
                text: taskText.trim(),
                priority: priority
            });
            
            await newTodo.save();
            res.redirect("/?created=true");
        } else {
            res.redirect("/");
        }
    } catch (error) {
        console.error('Error creating todo:', error);
        res.status(500).send('Error creating todo');
    }
});

app.post("/edit/:id", async function(req, res) {
    try {
        const itemId = req.params.id;
        const newText = req.body.editText;
        const newPriority = req.body.editPriority;
        
        if (newText && newText.trim() !== '') {
            await Todo.findByIdAndUpdate(itemId, {
                text: newText.trim(),
                priority: newPriority
            });
            res.redirect("/?updated=true");
        } else {
            res.redirect("/");
        }
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).send('Error updating todo');
    }
});

app.post("/delete/:id", async function(req, res) {
    try {
        const itemId = req.params.id;
        await Todo.findByIdAndDelete(itemId);
        
        res.redirect("/?deleted=true");
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).send('Error deleting todo');
    }
});

app.listen(4000, function(){
    console.log("Server started on port 4000");
});