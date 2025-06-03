const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors=require('cors');
const dotenv = require('dotenv');
const streamChat= require('stream-chat')
dotenv.config();

const authRoutes = require('./routes/auth.route');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use('/api/auth',authRoutes)

app.use(cors());



mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});