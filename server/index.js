require('dotenv').config();
const express = require('express');
const session = require('express-session');
const massive = require('massive')
const authCtrl = require('./controllers/authController');
const treasureCtrl = require ('./controllers/treasureController');
const auth = require('./middleware/authMiddleware');

const PORT = 4000;

const {CONNECTION_STRING, SESSION_SECRET} = process.env

const app = express();

app.use(express.json())



massive(CONNECTION_STRING).then(dbInstance => {
    app.set("db", dbInstance);
    console.log("Connected to database :D");
})

app.use(session ({
    resave: false,
    saveUninitialized: true,
    secret:SESSION_SECRET,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
}))

app.post('/auth/register', authCtrl.register)
app.post('/auth/register', authCtrl.login)
app.get('/auth/logout', authCtrl.logout)

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure)
app.get('/api/treasure/user', treasureCtrl.getUserTreasure)
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addMyTreasure)
app.get('/api/treasure.all', auth.usersOnly, treasureCtrl.getAllTreasure)

 



app.listen(PORT, ()=>  console.log(`listening on ${PORT} :)`))