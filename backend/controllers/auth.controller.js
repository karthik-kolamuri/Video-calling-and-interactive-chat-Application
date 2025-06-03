import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
export const signupController=async (req, res) => {
    //signup controller logic
    const {email,password,username} = req.body;
    if(!email || !password || !username){
        return res.status(400).json({message: 'Please fill all the fields'});
    }
    if(password.length < 6){
        return res.status(400).json({message: 'Password must be at least 6 characters long'});

    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });   
if (existingUser) {
        return res.status(400).json({message: 'User already exists'});
    }
    // Here you would typically hash the password and save the user to the database
    
    //adding profile picture 
    const index= Math.floor(Math.random() * 100)+1;
    const randomAvatar=`https://avatar.iran.liara.run/public/${index}.png`;
    const newUser = new User({
        username,
        email,
        password,
        profilePicture: randomAvatar
    });

    const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
    res.cookie('jwt',token,{
        maxAge: 3600000, // 1 hour
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set to true in production
        sameSite: 'strict' // Helps prevent CSRF attacks
    })
    await newUser.save();
    res.status(201).json({message: 'User created successfully', user: {email, username}});

}
export const loginController=async (req, res) => {
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({message: 'Please fill all the fields'});
    }
    // Here you would typically check the user credentials against the database
    const user = await User.findOne({   email });
    if (!user) {
        return res.status(400).json({message: 'User does not exist'});
    }
    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({message: 'Invalid password'});
    }  
    // Generate a JWT token
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
    res.cookie('jwt',token,{
        maxAge: 3600000, // 1 hour
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set to true in production
        sameSite: 'strict' // Helps prevent CSRF attacks
    })
    res.status(200).json({
        message: 'Login successful',
        user: {
            email: user.email,
            username: user.username,
            profilePicture: user.profilePicture
        }
    }); 
}
export const logoutController=async (req, res) => {
    res.clearCookie("jwt")
    res.status(200).json({message: 'Logout successful'});
}