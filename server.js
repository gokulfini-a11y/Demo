const express = require('express');
const path = require('path');
const hbs = require('hbs');

const app = express();
const PORT = process.env.PORT || 3000;

// Setup Handlebars
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Serve Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Main Route
app.get('/', (req, res) => {
    res.render('index', {
        title: "The Salaryman Sprint",
        description: "Run from the paperwork! Jump with Space/Up, Duck with Down."
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`\n👔 Salaryman Sprint is running!`);
    console.log(`👉 Open http://localhost:${PORT} in your browser.\n`);
});