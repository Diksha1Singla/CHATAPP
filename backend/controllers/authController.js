import { generateToken } from "../lib/utils.js";
import Users from "../models/userModels.js"
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js"

export const signup = async(req,res) => {
    const {fullName, email, password} = req.body;
    try {
        if(password.length<6){
            return res.status(404).json({message:"Password must be atleast 6 characters long"});
        }
        if(!password || !fullName || !email){
            return res.status(404).json({message:"All fields are required"});
        }
        const user = await Users.findOne({email}).lean();
        if(user){
            return res.status(404).json({message:"Email already exists"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const newuser = new Users({
            fullName,email,
            password:hashedPassword
        })
        if(newuser){
            const token = generateToken(newuser._id,res);
            await newuser.save();
            res.status(201).json({
                _id:newuser._id,
                fullName:newuser.fullName,
                email:newuser.email,
                profilePic:newuser.profilePic,
                token:token
            })
        }
        else{
            return res.status(404).json({message:"Failed to create user"});
        }
    } catch (error) {
        console.log("Error in signup",error.message);
        res.status(500).json({message:"Internal server error"});
    }
}
export const login = async(req,res) => {
    const {email,password} = req.body;
    try {
        const user = await Users.findOne({email});
        if(!user){
            return res.status(404).json({message:"Email does not exist"});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(404).json({message:"Invalid password"});
        }
        generateToken(user._id,res);
        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic
        })
    } catch (error) {
        console.log("Error in login Controller: ",error.message);
        res.status(500).json({message:"Internal Server Error"})
    }
}
export const logout = (req,res) => {
    try{
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"Logout Successfull"});
        req.headers['token'] = null;
    }
    catch(error){
        console.log("Error in logout controller: ",error.message);
        res.status(500).json({message:"Internal Server Error"})
    }
}

export const updateProfile = async(req,res) =>{
    try {
        const {profilePic} = req.body;
        const userID = req.user._id;
        if(!profilePic){
            return res.status(400).json({message:"Please provide a profile picture"});
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updtaedUser = await Users.findByIdAndUpdate(userID,{profilePic:uploadResponse.secure_url},{new:true,select: "-password -__v"})
        res.status(200).json(updtaedUser)
    } catch (error) {
        console.log("Error in update Profile:",error.message)
        res.status(500).json({message:"Internal Server error in profile updation"})
    }
}

export const checkAuth = (req,res)=>{
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("Error in checkAuth Controller",error.message)
        res.status(500).json({message:"Internal Server error in CheckAuth Controller"})
    }
}