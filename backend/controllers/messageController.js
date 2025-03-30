import userModel from "../models/userModels.js"
import msgModel from "../models/messageModel.js"
import cloudinary from "../lib/cloudinary.js"
import { getRecieverSocketId , io } from "../lib/socket.js";

export const getUsersForSidebar=async(req,res)=>{
    try {
        // console.log("user: ",req.user)
        const loggedInUserId = req.user._id;
        const filterNonLogInUsers = await userModel.find({_id:{$ne:loggedInUserId}}).select("-password");
        res.status(200).json(filterNonLogInUsers);
    } catch (error) {
        console.error("Error in getUserForSidebar conotroller: ",error.message)
        res.status(500).json({error:"Internal Server error in getUserForSidebar conotroller"})
    }
}

export const getMessages = async(req,res)=>{
    try {
        const {id:userToChatId} = req.params;
        const MyId = req.user._id
        const messages = await msgModel.find({
            $or:[
                {senderId:MyId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:MyId}
            ]
        })
        res.status(200).json(messages)
    } catch (error) {
        console.error("Error in getMessages conotroller: ",error.message)
        res.status(500).json({error:"Internal Server error in getMessages conotroller"})
    }
}

export const sendMessages = async(req,res)=>{
    try {
        const {text, image} = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id
        
        let imageUrl;
        if(image){
            // uploading image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;           
        }
        const message = new msgModel({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })
        await message.save();
        const recieverSocketId = getRecieverSocketId(receiverId)

        // if(recieverSocketId) i.e reciever is online because io.emit bradcast to all client therefore using io.to(recieverId).emit
        if(recieverSocketId){
            io.to(recieverSocketId).emit("newMessage",message)
        }
       
        res.status(201).json(message)
    } catch (error) {
       console.error("Error in sendMessages controller: ",error.message)
        res.status(500).json({error:"Internal Server error in sendMessages conotroller"})
    }
}