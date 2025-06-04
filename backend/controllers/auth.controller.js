// const User= require('../models/User');
import User from '../models/User.js';
// const jwt = require('jsonwebtoken');
import jwt from 'jsonwebtoken';
// const { createStreamUser } = require('../lib/stream');
import { createStreamUser } from '../lib/stream.js';
export const signupController=async (req, res) => {
    //signup controller logic
    const {email,password,fullname,username} = req.body;
    if(!email || !password || !fullname ){
        return res.status(400).json({message: 'Please fill all the fields'});
    }
    if(password.length < 6){
        return res.status(400).json({message: 'Password must be at least 6 characters long'});

    }
    // Check if user already exists
    const existingUser = await User.findOne({email});   
if (existingUser) {
        return res.status(400).json({message: 'User already exists'});
    }
    // Here you would typically hash the password and save the user to the database
    
    //adding profile picture 
    const index= Math.floor(Math.random() * 100)+1;
    const randomAvatar=`https://avatar.iran.liara.run/public/${index}.png`;
    const newUser = new User({
        
        fullname, // Add this line
        email,
        password,
        profilePicture: randomAvatar,
        username:username || fullname,
    });

    // Create a Stream user
    try {
        await createStreamUser({
            id: newUser._id.toString(),
            name: username,
            image: randomAvatar
        });
    console.log(`Stream user created: ${newUser.username}`);

    } catch (error) {
        console.error('Error creating Stream user:', error);
        return res.status(500).json({message: 'Error creating Stream user'});
    }

    const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
    res.cookie('jwt',token,{
        maxAge: 3600000, // 1 hour
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set to true in production
        sameSite: 'strict' // Helps prevent CSRF attacks
    }) 
    // Save the user to the database
    await newUser.save();
    
    res.status(201).json({message: 'User created successfully', user: {email, fullname}});

}

export const loginController=async (req, res) => {
   
    //login controller logic
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({message: 'Please fill all the fields'});
    }
    // Check if user exists
    const existingUser = await User.findOne({email});
    if (!existingUser) {
        return res.status(400).json({message: 'User does not exist'});
    }
    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
        return res.status(400).json({message: 'Invalid password'});
    }
    
    const token = jwt.sign({id: existingUser._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
    res.cookie('jwt',token,{
        maxAge: 3600000, // 1 hour
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set to true in production
        sameSite: 'strict' // Helps prevent CSRF attacks
    })
    
    res.status(200).json({message: 'Login successful', user: {email, fullname: existingUser.fullname}});            
}
export const logoutController=async (req, res) => {
    
    //logout controller logic
    res.clearCookie('jwt'); // Clear the cookie
    res.status(200).json({message: 'Logout successful'});
}