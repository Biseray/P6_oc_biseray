const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const path = require('path');

const saucesRoutes = require('./routes/sauce');

const userRoutes = require('./routes/user');


 
mongoose.connect((process.env.MONGOOSE),


    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


const app = express();

app.use(express.json());
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();


});


app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use((req, res, next) => {
    res.status(404).json({message: "l'url est incorrect"});
  });
module.exports = app;

