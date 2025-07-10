const express = require('express');
const app = express();

app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

let items = [];

app.get("/", function (req, res) {
    res.render("list", { ejes: items });
});

app.post("/", function (req, res) {
    const item = req.body.ele1;
    if (item && item.trim() !== "") {
        items.push(item);
        res.sendStatus(200);  // important: just send 200 for AJAX
    } else {
        res.sendStatus(400);
    }
});

const port = process.env.PORT || 4000;
app.listen(port, function () {
    console.log("Server started on port " + port);
});
