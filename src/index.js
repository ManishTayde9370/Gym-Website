const express = require("express");
const path = require("path");
const app = express();
const LogInCollection = require("./mongo");
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const templatePath = path.join(__dirname, '../templates');
const publicPath = path.join(__dirname, '../public');

app.set('views', templatePath);
app.use(express.static(publicPath));

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../tempelates/signup.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../tempelates/login.html'));
});

app.post('/signup', async (req, res) => {
    try {
        const checking = await LogInCollection.findOne({ name: req.body.name });
        if (checking) {
            res.send("User with this name already exists");
        } else {
            const data = {
                name: req.body.name,
                password: req.body.password
            };
            await LogInCollection.insertMany([data]);
            res.status(201).sendFile(path.join(__dirname, '../tempelates/home.html'));
        }
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send("An error occurred while processing your request");
    }
});

app.post('/login', async (req, res) => {
    try {
        const check = await LogInCollection.findOne({ name: req.body.name });
        if (check.password === req.body.password) {
            res.status(201).sendFile(path.join(__dirname, '../tempelates/home.html'));
        } else {
            res.send("Incorrect password");
        }
    } catch (e) {
        res.send("Wrong details");
    }
});

app.listen(port, () => {
    console.log('Server is running on port', port);
});
