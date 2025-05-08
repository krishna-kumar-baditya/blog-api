const express = require('express');
const path = require('path');
require('dotenv').config();
const db = require('./config/db');
const app = express();
const session = require('express-session');


app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({
    extended: true
}));

// Middleware for parsing JSON data
app.use(express.json());


app.use(session({
    secret: 'MyS3CR3T#@!@CGGmn',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));


app.use((req, res, next) => {
    let auth = require('./middleware/auth')(req, res, next)
    app.use(auth.initialize());
    if (req.session.token && req.session.token != null) {
        req.headers['token'] = req.session.token;
    }
    next();
});



app.use('/user', require('./routes/user.routes'));
app.use('/blogcategory', require('./routes/category.routes'));
app.use('/blogpost', require('./routes/blogpost.routes'));



app.listen(process.env.PORT, async () => {
    await db.connection();
    console.log(`Server is running on http://127.0.0.1:${process.env.PORT}`)
})