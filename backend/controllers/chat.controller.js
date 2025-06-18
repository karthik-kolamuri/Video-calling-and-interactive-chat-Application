import {generateStreamToken} from '../lib/stream.js';

export const getStreamToken=async(requestAnimationFrame,res)=>{
    try{

    //this is the token generation for the stream chat which is used to chat,,video calls  with other users....
    const token=generateStreamToken(req.user._id);
    res.status(200).json({
        success:true,
        token:token
    });
    }
    catch(error){
        console.error('Error generating Stream token:', error);
        res.status(500).json({
            success:false,
            message:'Failed to generate Stream token'
        });
    }

}