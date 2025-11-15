const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');
const globalErrorHandler = require('./middleware/globalErrorHandler');


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});

app.get("/login", (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'login.html'));
});

app.use('/api',postRoutes);
app.use('/api', userRoutes);

app.use(errorHandler);
app.use(globalErrorHandler);


mongoose.connect('mongodb://127.0.0.1:27017/facelinkDB')
    .then(() => console.log('MongoDB tilsluttet!'))
    .catch(err => console.error('MongoDB fejl:', err));

app.listen(port, () => console.log('Server klar op http://localhost:3000'));