// const express = require('express');
import express from 'express'
const app = express();
// const mongoose = require('mongoose');
import mongoose from 'mongoose';
// const cors=require('cors');
import cors from 'cors';
// const dotenv = require('dotenv');
import dotenv from 'dotenv'
// const streamChat= require('stream-chat')
import { StreamChat } from 'stream-chat';
// const cookieParser=require('cookie-parser')
import cookieParser from 'cookie-parser';
dotenv.config();

// const authRoutes = require('./routes/auth.route');
import authRoutes  from './routes/auth.route.js'

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
import session from 'express-session';

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'yourFallbackSecretKey',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      sameSite: 'strict',
      httpOnly: true,
    },
  })
);

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