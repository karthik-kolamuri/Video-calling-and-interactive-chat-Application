import User from "./../models/User.js";
import FriendRequest from "../models/FriendRequest.js";
export const getRecommendations=async (req,res)=>{
    try {
        const userId=req.user._id.toString();
        const user=req.user;
        console.log("Fetching recommendations");
        console.log(userId);
        
        const recommendations=await User.find({ 
            $and :[
                {
                    _id:{$ne:userId} // excludes ythe <!--  -->
                },
                {
                    $id:{$nin:userId.friends}
                },
                {
                    isOnboarded:true
                }
            ]
        });
        if(!recommendations){
            return res.status(400).json({
                success:false,
                message:"No recommendations found"
            })
        }

        res.status(200).json({
            success :true,
            message:"Heree are the recommendations",
            data:recommendations

        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}   

export const getMyFriends=async (req,res)=>{
    try {
        const userId=req.user._id.toString();
        console.log(userId)
        console.log("Fetching My Friends list...")
        const user=await User.findById(userId).select("friends").populate("friends ","username profilePic nativeLanguage learningLanguage");
        res.status(200).json({
            success:true,
            message:"Fetching the details of your friends",
            data:user.friends
        })
    } catch (error) {
         res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
export const sendFriendRequest=async(req,res)=>{
    try {
        const senderId=req.user._id.toString();
        const receiverId=req.params.id;
        console.log(senderId);
        console.log(receiverId);
        if (senderId===receiverId){
            return res.status(400).json({
                success:false,
                message:"You can't send a friend request to yourself"
            })
        }
        
        const sender=await User.findById(senderId); 
        const receiver=await User.findById(receiverId);
        if(!sender){
            return res.status(400).json({
                success:false,
                message:"Sender not found"
            })
        }
        if(!receiver){
            return res.status(400).json({
                success:false,
                message:"Receiver not found"
            })
        }
        //here we check if the recipient has already  a friend to the sender ...
        if(sender.friendRequests.includes(receiverId)){
            return res.status(400).json({
                success:false,
                message:"You have already sent a friend request to this user"
            })
        }


        //here we check if the sender has already sent a friend request to the recipient...
        const friendRequest=await FriendRequest.findOne({
            $or:[
                {
                    sender:senderId,
                    receiver:receiverId
                },
                {
                    sender:receiverId,
                    receiver:senderId
                }
            ]
        })
        if(friendRequest){
            return res.status(400).json({
                success:false,
                message:"You have already sent a friend request to this user"
            })
        }
        //here we create a new friend request
        const newFriendRequest=new FriendRequest({
            sender:senderId,
            receiver:receiverId
        })
        await newFriendRequest.save();

            res.status(200).json({
            success:true,
            message:"Friend request sent successfully",
            data:friendRequest
        })

    }catch(error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const acceptFriendRequest=async(req,res)=>{
    try {
        
        // const senderId=req.user._id.toString();
        const requestId=req.params.id;
       
        const friendRequest=await FriendRequest.findOne(requestId)
        if(!friendRequest){
            return res.status(400).json({
                success:false,
                message:"Friend request not found"
            })
        }
        
        //verify the current user is the recipient of the friend request
        if(friendRequest.receiver.toString()!==req.user._id.toString()){
            return res.status(400).json({
                success:false,
                message:"You can't accept this friend request"
            })
        }
        friendRequest.status="accepted";
        await friendRequest.save();



        ///herer we add the user into the friend Request of the sender as well as receiver  
        await User.findByIdAndUpdate(friendRequest.sender,{
            $addToSet:{
                friends:friendRequest.recipient
            }
        });
         
        await User.findByIdAndUpdate(friendRequest.recipient,{
            $addToSet:{
                friends:friendRequest.sender
            }
        })
        res.status(200).json({
            success:true,
            message:"Friend request Accepted..."
        })
    } catch (error) {
        res.status(501).json({
            
        })
    }
}

export const getFriendRequest=async(req,res)=>{
    try{
        //trying to get the friend request of the current user which is not accepted yet...
        const incomingReq=await FriendRequest.find({
            receiver:req.user._id.toString(),
            status:"pending"
        }).populate("sender","username profilePic nativeLanguage learningLanguage");

        //trying to get the friend request of the current user which is not accepted ...
        const acceptedReq=await FriendRequest.find({
            receiver:req.user._id.toString(),
            status:"accepted"
        }).populate("sender","username profilePic ");

        res.status(200).json({
            success:true,
            message:"Here are your friend requests",
            data:{
                incomingReq,
                acceptedReq
            }
        })
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:"Server Error...."
        })
    }
}
export const getOutgoingFriendRequests=async(req,res)=>{
    try{
        //trying to get the friend request of the current user which is not accepted yet...
        const outgoingReq=await FriendRequest.find({
            sender:req.user._id.toString(),
            status:"pending"
        }).populate("receiver","username profilePic nativeLanguage learningLanguage");

        res.status(200).json({
            success:true,
            message:"Here are your outgoing friend requests",
            data:outgoingReq
        })
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:"Server Error...."
        })
    }
}