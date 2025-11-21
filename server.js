const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const morgan = require('morgan');

const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');
const globalErrorHandler = require('./middleware/globalErrorHandler');




const app = express();

app.use(morgan('dev'));
app.use(morgan('method :url -> status=:status :response-time ms'));

const port = process.env.PORT;

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});

app.get("/login", (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'login.html'));
});

app.get("/register", (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'register.html'));
});

app.get("/profile", (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'profile.html'));
});

app.use('/api',postRoutes);
app.use('/api', userRoutes);

app.use(errorHandler);
app.use(globalErrorHandler);


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB tilsluttet!'))
    .catch(err => console.error('MongoDB fejl:', err));

app.listen(port, () => console.log('Server klar op http://localhost:3000'));