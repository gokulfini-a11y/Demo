const express = require('express');
const path = require('path');
const hbs = require('hbs');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index', { title: "BUG HUNTER: DEPLOYMENT DAY" });
});

app.listen(PORT, () => {
    console.log(`🚀 Dev simulation running at http://localhost:${PORT}`);
});
