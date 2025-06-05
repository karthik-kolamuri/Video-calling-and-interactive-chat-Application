import jwt from 'jsonwebtoken';

import User from '../models/User.js';

export const authRoute = async (req, res, next) => {
    try {
        console.log('Authenticating...')
        const token=req.session?.jwt;
        console.log(token)
    if(!token){
        return res.status(401).json({
            message:"Unauthorized...."
        })
    }
    const decodeToken=jwt.verify(token,process.env.JWT_SECRET)
    if(!decodeToken){
        return res.status(401).json({
            message:"Unauthorized--Invalid token..."
        })
    }
    const user=await User.findById(decodeToken.id).select('-password');
        if(!user){
        return res.status(401).json({
            message:"User not Found..."
        })
    }
    req.user=user;
    next();
    console.log('User is Authenticated...')
        
    } catch (error) {
        res.status(501).json({
            message:`Server errro ${error}`
        })      
    }
}